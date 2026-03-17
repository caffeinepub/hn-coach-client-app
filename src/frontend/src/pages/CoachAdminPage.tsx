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
import { Calendar, Loader2, Megaphone, Plus, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAllPromotions,
  useCreateClass,
  useCreatePromotion,
  useUpcomingClasses,
} from "../hooks/useQueries";

export default function CoachAdminPage() {
  const [classForm, setClassForm] = useState({
    name: "",
    description: "",
    date: "",
    capacity: "",
  });
  const [promoForm, setPromoForm] = useState({ title: "", body: "" });

  const createClass = useCreateClass();
  const createPromo = useCreatePromotion();
  const { data: classes = [] } = useUpcomingClasses();
  const { data: promotions = [] } = useAllPromotions();

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
      });
      toast.success("Class created successfully!");
      setClassForm({ name: "", description: "", date: "", capacity: "" });
    } catch {
      toast.error("Failed to create class");
    }
  };

  const handleCreatePromo = async () => {
    if (!promoForm.title || !promoForm.body) {
      toast.error("Please fill in all promotion fields");
      return;
    }
    try {
      await createPromo.mutateAsync(promoForm);
      toast.success("Promotion published!");
      setPromoForm({ title: "", body: "" });
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
                          <Users className="w-3 h-3 text-muted-foreground" />
                          <Badge variant="secondary" className="text-xs">
                            {cls.enrolled.length}/{cls.capacity.toString()}
                          </Badge>
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
                  rows={5}
                />
              </div>
              <Button
                className="w-full gap-2"
                onClick={handleCreatePromo}
                disabled={createPromo.isPending}
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
                        className="p-3 rounded-md bg-muted"
                        data-ocid={`admin.promo.item.${i + 1}`}
                      >
                        <p className="font-body font-semibold text-sm">
                          {promo.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {promo.body}
                        </p>
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
