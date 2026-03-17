import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  ImagePlus,
  Loader2,
  Megaphone,
  Plus,
  Trash2,
  Users,
  Video,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useBlobStorage } from "../hooks/useBlobStorage";
import {
  useAllPromotions,
  useCreateClass,
  useCreatePromotion,
  useDeleteClass,
  useDeletePromotion,
  useUpcomingClasses,
} from "../hooks/useQueries";

export default function CoachAdminPage() {
  const [classForm, setClassForm] = useState({
    name: "",
    description: "",
    date: "",
    capacity: "",
    zoomLink: "",
  });
  const [promoForm, setPromoForm] = useState({
    title: "",
    body: "",
    imageUrl: "",
  });
  const [promoImagePreview, setPromoImagePreview] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const createClass = useCreateClass();
  const createPromo = useCreatePromotion();
  const deleteClass = useDeleteClass();
  const deletePromotion = useDeletePromotion();
  const { data: classes = [] } = useUpcomingClasses();
  const { data: promotions = [] } = useAllPromotions();
  const { uploadFile, isUploading, uploadProgress } = useBlobStorage();

  const handleCreateClass = async () => {
    if (
      !classForm.name ||
      !classForm.description ||
      !classForm.date ||
      !classForm.capacity
    ) {
      toast.error("Please fill in all class fields");
      return;
    }
    try {
      await createClass.mutateAsync({
        name: classForm.name,
        description: classForm.description,
        date: classForm.date,
        capacity: BigInt(classForm.capacity),
        zoomLink: classForm.zoomLink.trim() || null,
      });
      toast.success("Class created successfully!");
      setClassForm({
        name: "",
        description: "",
        date: "",
        capacity: "",
        zoomLink: "",
      });
    } catch {
      toast.error("Failed to create class");
    }
  };

  const handleDeleteClass = async (id: bigint) => {
    try {
      await deleteClass.mutateAsync(id);
      toast.success("Class deleted");
    } catch {
      toast.error("Failed to delete class");
    }
  };

  const handleDeletePromotion = async (id: bigint) => {
    try {
      await deletePromotion.mutateAsync(id);
      toast.success("Promotion deleted");
    } catch {
      toast.error("Failed to delete promotion");
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const url = await uploadFile(file);
      setPromoForm((p) => ({ ...p, imageUrl: url }));
      setPromoImagePreview(URL.createObjectURL(file));
      toast.success("Image uploaded!");
    } catch {
      toast.error("Failed to upload image");
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleRemoveImage = () => {
    setPromoForm((p) => ({ ...p, imageUrl: "" }));
    setPromoImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCreatePromo = async () => {
    if (!promoForm.title || !promoForm.body) {
      toast.error("Please fill in all promotion fields");
      return;
    }
    try {
      await createPromo.mutateAsync({
        title: promoForm.title,
        body: promoForm.body,
        imageUrl: promoForm.imageUrl || null,
      });
      toast.success("Promotion published!");
      setPromoForm({ title: "", body: "", imageUrl: "" });
      setPromoImagePreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      toast.error("Failed to create promotion");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm">🛡</span>
          </div>
          <h2 className="font-display font-bold text-3xl text-foreground">
            Coach Panel
          </h2>
        </div>
        <p className="text-muted-foreground font-body">
          Manage classes and promotions for your clients
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Class */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-primary/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-display text-xl">
                    Create New Class
                  </CardTitle>
                  <CardDescription className="font-body text-sm">
                    Schedule a fitness session
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Class Name</Label>
                <Input
                  placeholder="e.g. Morning HIIT Bootcamp"
                  value={classForm.name}
                  onChange={(e) =>
                    setClassForm((p) => ({ ...p, name: e.target.value }))
                  }
                  data-ocid="admin.class_name.input"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="What will clients expect?"
                  value={classForm.description}
                  onChange={(e) =>
                    setClassForm((p) => ({ ...p, description: e.target.value }))
                  }
                  data-ocid="admin.class_description.textarea"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={classForm.date}
                    onChange={(e) =>
                      setClassForm((p) => ({ ...p, date: e.target.value }))
                    }
                    data-ocid="admin.class_date.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Capacity</Label>
                  <Input
                    type="number"
                    placeholder="20"
                    min="1"
                    value={classForm.capacity}
                    onChange={(e) =>
                      setClassForm((p) => ({ ...p, capacity: e.target.value }))
                    }
                    data-ocid="admin.class_capacity.input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-muted-foreground" />
                  Zoom Link{" "}
                  <span className="text-muted-foreground/60 text-xs font-normal">
                    (optional)
                  </span>
                </Label>
                <Input
                  placeholder="https://zoom.us/j/..."
                  value={classForm.zoomLink}
                  onChange={(e) =>
                    setClassForm((p) => ({ ...p, zoomLink: e.target.value }))
                  }
                  data-ocid="admin.class_zoom.input"
                />
              </div>
              <Button
                className="w-full gap-2"
                onClick={handleCreateClass}
                disabled={createClass.isPending}
                data-ocid="admin.create_class.button"
              >
                {createClass.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Create Class
                  </>
                )}
              </Button>

              <Separator />

              <div>
                <h4 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                  Upcoming Classes ({classes.length})
                </h4>
                {classes.length === 0 ? (
                  <p
                    className="text-muted-foreground text-sm font-body text-center py-4"
                    data-ocid="admin.classes.empty_state"
                  >
                    No classes scheduled yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {classes.map((cls, i) => (
                      <div
                        key={cls.id.toString()}
                        className="flex items-center justify-between p-3 rounded-md bg-muted"
                        data-ocid={`admin.class.item.${i + 1}`}
                      >
                        <div>
                          <p className="font-body font-medium text-sm">
                            {cls.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {cls.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {cls.zoomLink && (
                            <Badge
                              variant="outline"
                              className="text-xs text-primary border-primary/30"
                            >
                              Zoom
                            </Badge>
                          )}
                          <Users className="w-3 h-3 text-muted-foreground" />
                          <Badge variant="secondary" className="text-xs">
                            {cls.enrolled.length}/{cls.capacity.toString()}
                          </Badge>
                          <button
                            type="button"
                            onClick={() => handleDeleteClass(cls.id)}
                            disabled={deleteClass.isPending}
                            data-ocid={`admin.class.delete_button.${i + 1}`}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Create Promotion */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-primary/20 flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-display text-xl">
                    Create Promotion
                  </CardTitle>
                  <CardDescription className="font-body text-sm">
                    Announce offers and updates
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="e.g. 20% Off Monthly Package"
                  value={promoForm.title}
                  onChange={(e) =>
                    setPromoForm((p) => ({ ...p, title: e.target.value }))
                  }
                  data-ocid="admin.promo_title.input"
                />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  placeholder="Details of your promotion..."
                  value={promoForm.body}
                  onChange={(e) =>
                    setPromoForm((p) => ({ ...p, body: e.target.value }))
                  }
                  data-ocid="admin.promo_body.textarea"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ImagePlus className="w-4 h-4 text-muted-foreground" />
                  Promo Image{" "}
                  <span className="text-muted-foreground/60 text-xs font-normal">
                    (optional)
                  </span>
                </Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFileChange}
                  data-ocid="admin.promo_image.upload_button"
                />
                {promoImagePreview ? (
                  <div className="relative rounded-lg overflow-hidden border border-border">
                    <img
                      src={promoImagePreview}
                      alt="Preview"
                      className="w-full object-cover"
                      style={{ maxHeight: "180px" }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                      data-ocid="admin.promo_image.delete_button"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full border-2 border-dashed border-border rounded-lg py-8 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    data-ocid="admin.promo_image.dropzone"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-sm font-body">
                          Uploading... {uploadProgress}%
                        </span>
                      </>
                    ) : (
                      <>
                        <ImagePlus className="w-6 h-6" />
                        <span className="text-sm font-body">
                          Click to upload an image
                        </span>
                        <span className="text-xs opacity-60">
                          JPG, PNG, GIF up to 10MB
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <Button
                className="w-full gap-2"
                onClick={handleCreatePromo}
                disabled={createPromo.isPending || isUploading}
                data-ocid="admin.create_promo.button"
              >
                {createPromo.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    <Megaphone className="w-4 h-4" /> Publish Promotion
                  </>
                )}
              </Button>

              <Separator />

              <div>
                <h4 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                  Active Promotions ({promotions.length})
                </h4>
                {promotions.length === 0 ? (
                  <p
                    className="text-muted-foreground text-sm font-body text-center py-4"
                    data-ocid="admin.promos.empty_state"
                  >
                    No promotions published yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {promotions.map((promo, i) => (
                      <div
                        key={promo.id.toString()}
                        className="flex items-start justify-between gap-2 p-3 rounded-md bg-muted"
                        data-ocid={`admin.promo.item.${i + 1}`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-body font-semibold text-sm">
                            {promo.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {promo.body}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeletePromotion(promo.id)}
                          disabled={deletePromotion.isPending}
                          data-ocid={`admin.promo.delete_button.${i + 1}`}
                          className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
