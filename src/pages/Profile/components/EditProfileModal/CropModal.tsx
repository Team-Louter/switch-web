import { useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import * as S from './EditProfileModal.styled';
import { toast } from '@/store/toastStore';

interface CropModalProps {
  cropSrc: string;
  crop: { x: number; y: number };
  zoom: number;
  uploading: boolean;
  croppedAreaPixels: Area | null;
  setCrop: (crop: { x: number; y: number }) => void;
  setZoom: (zoom: number) => void;
  onCropComplete: (_: Area, areaPixels: Area) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const drawCircularImage = async (
  canvas: HTMLCanvasElement,
  imageSrc: string,
  croppedAreaPixels: Area | null,
  size: number,
  imageNaturalWidth: number,
  imageNaturalHeight: number,
): Promise<boolean> => {
  return new Promise((resolve) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(false);
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      try {
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
        ctx.scale(dpr, dpr);

        const radius = size / 2;
        ctx.clearRect(0, 0, size, size);
        ctx.beginPath();
        ctx.arc(radius, radius, radius, 0, Math.PI * 2);
        ctx.clip();

        const area = croppedAreaPixels || {
          x: 0,
          y: 0,
          width: imageNaturalWidth,
          height: imageNaturalHeight,
        };

        const cropAspect = area.width / area.height;
        const canvasAspect = 1; // 원형이므로 1:1

        let drawWidth = size;
        let drawHeight = size;
        let offsetX = 0;
        let offsetY = 0;

        if (cropAspect > canvasAspect) {
          // 가로가 길면 높이 기준
          drawWidth = size * cropAspect;
          offsetX = (size - drawWidth) / 2;
        } else {
          // 세로가 길면 너비 기준
          drawHeight = size / cropAspect;
          offsetY = (size - drawHeight) / 2;
        }

        ctx.drawImage(
          image,
          area.x,
          area.y,
          area.width,
          area.height,
          offsetX,
          offsetY,
          drawWidth,
          drawHeight,
        );
        resolve(true);
      } catch (err) {
        console.error('캔버스 렌더링 실패:', err);
        resolve(false);
      }
    };

    image.onerror = () => {
      console.error('이미지 로드 실패');
      resolve(false);
    };
  });
};

function CropModal({
  cropSrc,
  crop,
  zoom,
  uploading,
  croppedAreaPixels,
  setCrop,
  setZoom,
  onCropComplete,
  onConfirm,
  onCancel,
}: CropModalProps) {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const largePreviewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [imageNaturalSize, setImageNaturalSize] = useState({
    width: 0,
    height: 0,
  });

  // 원본 이미지 자연 크기 감지
  useEffect(() => {
    if (!cropSrc) return;

    const image = new Image();
    image.src = cropSrc;
    image.onload = () => {
      setImageNaturalSize({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };
    image.onerror = () => {
      toast.error('이미지 로드에 실패했습니다');
      console.error('이미지 로드 실패: 자연 크기 감지');
    };
  }, [cropSrc]);

  // 미리보기 렌더링
  useEffect(() => {
    if (!previewCanvasRef.current || !cropSrc) return;

    drawCircularImage(
      previewCanvasRef.current,
      cropSrc,
      croppedAreaPixels,
      80,
      imageNaturalSize.width,
      imageNaturalSize.height,
    ).catch((err) => {
      console.error('작은 미리보기 렌더링 실패:', err);
    });
  }, [cropSrc, crop, zoom, croppedAreaPixels, imageNaturalSize]);

  // 확대 미리보기 렌더링
  useEffect(() => {
    if (!largePreviewCanvasRef.current || !cropSrc || !showPreviewModal) return;

    drawCircularImage(
      largePreviewCanvasRef.current,
      cropSrc,
      croppedAreaPixels,
      240,
      imageNaturalSize.width,
      imageNaturalSize.height,
    ).catch((err) => {
      console.error('확대한 미리보기 렌더링 실패:', err);
    });
  }, [
    cropSrc,
    crop,
    zoom,
    croppedAreaPixels,
    showPreviewModal,
    imageNaturalSize,
  ]);

  return (
    <S.CropOverlay>
      <S.CropModal onClick={(e) => e.stopPropagation()}>
        <S.CropTitle>이미지 자르기</S.CropTitle>
        <S.CropArea>
          <Cropper
            image={cropSrc}
            crop={crop}
            zoom={zoom}
            aspect={3 / 2}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </S.CropArea>
        <S.CropZoomRow>
          <S.CropZoomLabel>확대</S.CropZoomLabel>
          <S.CropZoomSlider
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </S.CropZoomRow>
        <S.CropButtonRow>
          <S.CropPreviewCanvas
            ref={previewCanvasRef}
            onClick={() => setShowPreviewModal(true)}
            style={{ cursor: 'pointer' }}
          />
          <S.ButtonGroup>
            <S.CancelButton type="button" onClick={onCancel}>
              취소
            </S.CancelButton>
            <S.SaveButton
              type="button"
              onClick={onConfirm}
              disabled={uploading}
            >
              {uploading ? '업로드 중...' : '적용'}
            </S.SaveButton>
          </S.ButtonGroup>
        </S.CropButtonRow>

        {/* 확대 미리보기 모달 */}
        {showPreviewModal && (
          <S.PreviewModalOverlay onClick={() => setShowPreviewModal(false)}>
            <S.PreviewModal onClick={(e) => e.stopPropagation()}>
              <S.PreviewModalCanvas ref={largePreviewCanvasRef} />
            </S.PreviewModal>
          </S.PreviewModalOverlay>
        )}
      </S.CropModal>
    </S.CropOverlay>
  );
}

export default CropModal;
