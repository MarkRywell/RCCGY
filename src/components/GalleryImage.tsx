type GalleryImageProps = {
  src: string;
  alt: string;
  className?: string;
};

function GalleryImage({ src, alt, className }: GalleryImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`rounded-lg object-cover w-full h-full ${className ?? ""}`}
    />
  );
}

export default GalleryImage;
