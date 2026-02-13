import { useState, useCallback, useRef } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X, Crop, Loader2 } from "lucide-react";

const STANDARD_WIDTH = 800;
const STANDARD_HEIGHT = 800;
const ASPECT_RATIO = STANDARD_WIDTH / STANDARD_HEIGHT;

interface ProductImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.crossOrigin = "anonymous";
    image.src = url;
  });
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = STANDARD_WIDTH;
  canvas.height = STANDARD_HEIGHT;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, STANDARD_WIDTH, STANDARD_HEIGHT);

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    STANDARD_WIDTH,
    STANDARD_HEIGHT
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/webp", 0.85);
  });
}

const ProductImageUpload = ({ images, onChange }: ProductImageUploadProps) => {
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione apenas arquivos de imagem");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setRawImage(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCropDialogOpen(true);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCropAndUpload = async () => {
    if (!rawImage || !croppedAreaPixels) return;
    setUploading(true);
    try {
      const croppedBlob = await getCroppedImg(rawImage, croppedAreaPixels);
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, croppedBlob, { contentType: "image/webp" });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      onChange([...images, urlData.publicUrl]);
      setCropDialogOpen(false);
      setRawImage(null);
      toast.success("Imagem enviada!");
    } catch (err: any) {
      toast.error("Erro ao enviar imagem: " + (err.message || ""));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <Label>Imagens do Produto ({STANDARD_WIDTH}x{STANDARD_HEIGHT}px)</Label>

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative group rounded-md overflow-hidden border border-border aspect-square">
              <img src={url} alt={`Produto ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed border-2"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-4 w-4 mr-2" />
        Adicionar Imagem
      </Button>

      <Dialog open={cropDialogOpen} onOpenChange={(v) => { if (!uploading) setCropDialogOpen(v); }}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crop className="h-5 w-5" /> Ajustar Imagem
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Ajuste o recorte para que a imagem fique no tamanho padrão ({STANDARD_WIDTH}x{STANDARD_HEIGHT}px).
          </p>

          <div className="relative w-full h-[350px] bg-secondary rounded-md overflow-hidden">
            {rawImage && (
              <Cropper
                image={rawImage}
                crop={crop}
                zoom={zoom}
                aspect={ASPECT_RATIO}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            <Label className="text-sm shrink-0">Zoom</Label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setCropDialogOpen(false)} disabled={uploading}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleCropAndUpload} disabled={uploading} className="gold-gradient text-primary-foreground font-bold">
              {uploading ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Enviando...</> : "Recortar e Enviar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductImageUpload;
