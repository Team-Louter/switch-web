import { useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import * as S from './EditProfileModal.styled';

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

  // 미리보기 렌더링
  useEffect(() => {
    if (!previewCanvasRef.current || !cropSrc || !croppedAreaPixels) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 80;

    const image = new Image();
    image.src = cropSrc;
    image.onload = () => {
      // 고해상도를 위한거
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      // CSS 표시 크기는 원래대로
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      // 스케일링 적용
      ctx.scale(dpr, dpr);

      const radius = size / 2;

      ctx.clearRect(0, 0, size, size);
      ctx.beginPath();
      ctx.arc(radius, radius, radius, 0, Math.PI * 2);
      ctx.clip();

      const cropAspect = croppedAreaPixels.width / croppedAreaPixels.height;
      const canvasAspect = 1; // 원형이므로 1대1

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

      // 크롭된 부분만 그리기
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        offsetX,
        offsetY,
        drawWidth,
        drawHeight,
      );
    };
  }, [cropSrc, crop, zoom, croppedAreaPixels]);

  // 확대 미리보기 렌더링
  useEffect(() => {
    if (
      !largePreviewCanvasRef.current ||
      !cropSrc ||
      !croppedAreaPixels ||
      !showPreviewModal
    )
      return;

    const canvas = largePreviewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 240;

    const image = new Image();
    image.src = cropSrc;
    image.onload = () => {
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

      const cropAspect = croppedAreaPixels.width / croppedAreaPixels.height;
      const canvasAspect = 1;

      let drawWidth = size;
      let drawHeight = size;
      let offsetX = 0;
      let offsetY = 0;

      if (cropAspect > canvasAspect) {
        drawWidth = size * cropAspect;
        offsetX = (size - drawWidth) / 2;
      } else {
        drawHeight = size / cropAspect;
        offsetY = (size - drawHeight) / 2;
      }

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        offsetX,
        offsetY,
        drawWidth,
        drawHeight,
      );
    };
  }, [cropSrc, crop, zoom, croppedAreaPixels, showPreviewModal]);

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
