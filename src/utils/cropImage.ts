import type { Area } from 'react-easy-crop';

/** canvas로 픽셀 크롭 후 Blob 반환 (JPEG 95%) */
export async function getCroppedBlob(
  imageSrc: string,
  pixelCrop: Area,
  outputWidth = 356,
  outputHeight = 236,
): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputWidth,
    outputHeight,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('canvas toBlob failed'));
      },
      'image/webp',
      0.85,
    );
  });
}
