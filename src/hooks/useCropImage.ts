import { useState, useCallback } from 'react';
import type { Area } from 'react-easy-crop';
import { getCroppedBlob } from '@/utils/cropImage';
import { uploadFile } from '@/api/Post';
import { toast } from '@/store/toastStore';

interface UseCropImageReturnParams {
  cropSrc: string | null;
  crop: { x: number; y: number };
  zoom: number;
  uploading: boolean;
  profileImageUrl: string;
  imageFileName: string;
  croppedAreaPixels: Area | null;
  setCrop: (crop: { x: number; y: number }) => void;
  setZoom: (zoom: number) => void;
  onCropComplete: (_: Area, areaPixels: Area) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCropConfirm: () => Promise<void>;
  handleCropCancel: () => void;
  resetImageFileName: () => void;
  resetProfileImageUrl: () => void;
  confirmImageFileName: () => void;
}

export function useCropImage(
  initialImageUrl: string,
): UseCropImageReturnParams {
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(initialImageUrl);
  const [originalFileName, setOriginalFileName] = useState<string>('');
  const [imageFileName, setImageFileName] = useState<string>(() => {
    // 변환용 임시 파일명이 있으면 사용
    const tempFileName = localStorage.getItem('tempProfileImageFileName');
    if (tempFileName) return tempFileName;

    // 원본 저장된 파일명
    const originalFileName = localStorage.getItem(
      'originalProfileImageFileName',
    );
    if (originalFileName) return originalFileName;

    return '';
  });

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginalFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropConfirm = async () => {
    if (!cropSrc || !croppedAreaPixels) return;
    setUploading(true);
    try {
      const fileName = originalFileName || 'profile.jpg';
      const blob = await getCroppedBlob(cropSrc, croppedAreaPixels);
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      const { url } = await uploadFile(file);
      setProfileImageUrl(url);
      setImageFileName(fileName);
      // 변환용 임시 파일명만 저장 (원본 파일명은 저장할 때)
      localStorage.setItem('tempProfileImageFileName', fileName);
      setCropSrc(null);
      toast.success('이미지 업로드 성공');
    } catch {
      toast.error('이미지 업로드 실패');
    } finally {
      setUploading(false);
    }
  };

  const handleCropCancel = () => {
    setCropSrc(null);
  };

  const resetImageFileName = () => {
    // 변환용을 원본으로 복원
    const originalFileName = localStorage.getItem(
      'originalProfileImageFileName',
    );
    if (originalFileName) {
      localStorage.setItem('tempProfileImageFileName', originalFileName);
      setImageFileName(originalFileName);
    } else {
      // 원본도 없으면 변환용 제거
      localStorage.removeItem('tempProfileImageFileName');
      setImageFileName('');
    }
  };

  const resetProfileImageUrl = () => {
    // 서버에서 받은 이미지URL 복원
    setProfileImageUrl(initialImageUrl);
  };

  const confirmImageFileName = () => {
    // 변환용 값을 원본으로 저장 (저장 완료)
    const tempFileName = localStorage.getItem('tempProfileImageFileName');
    if (tempFileName) {
      localStorage.setItem('originalProfileImageFileName', tempFileName);
    }
  };

  return {
    cropSrc,
    crop,
    zoom,
    uploading,
    profileImageUrl,
    imageFileName,
    croppedAreaPixels,
    setCrop,
    setZoom,
    onCropComplete,
    handleFileChange,
    handleCropConfirm,
    handleCropCancel,
    resetImageFileName,
    resetProfileImageUrl,
    confirmImageFileName,
  };
}
