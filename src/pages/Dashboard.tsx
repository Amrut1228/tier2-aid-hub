import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Star, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  customer_name: string;
  address: string;
  city: string;
  scheduled_date: string;
  scheduled_time: string;
  notes: string | null;
  status: string;
  total_price: number;
  services: {
    name: string;
    category: string;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    setUser(user);
    fetchBookings(user.id);
  };

  const fetchBookings = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        services (name, category)
      `)
      .eq("customer_id", userId)
      .order("scheduled_date", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  const cancelBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully",
      });
      if (user) fetchBookings(user.id);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      pending: { variant: "secondary", label: "Pending" },
      accepted: { variant: "default", label: "Confirmed" },
      completed: { variant: "outline", label: "Completed" },
      cancelled: { variant: "destructive", label: "Cancelled" },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filterBookings = (status?: string) => {
    if (!status) return bookings;
    return bookings.filter((b) => b.status === status);
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{booking.services.name}</CardTitle>
            <CardDescription>{booking.services.category}</CardDescription>
          </div>
          {getStatusBadge(booking.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{format(new Date(booking.scheduled_date), "PPP")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{booking.scheduled_time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{booking.city}</span>
        </div>
        <div className="pt-2 border-t">
          <p className="text-lg font-semibold text-primary">₹{booking.total_price}</p>
        </div>
        {booking.status === "pending" && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => cancelBooking(booking.id)}
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        )}
        {booking.status === "completed" && (
          <Button variant="outline" size="sm" className="w-full">
            <Star className="h-4 w-4 mr-1" />
            Rate Service
          </Button>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground mb-8">Manage your service bookings</p>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({filterBookings("pending").length})
              </TabsTrigger>
              <TabsTrigger value="accepted">
                Confirmed ({filterBookings("accepted").length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({filterBookings("completed").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {bookings.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">No bookings yet</p>
                    <Button onClick={() => navigate("/services")}>Browse Services</Button>
                  </CardContent>
                </Card>
              ) : (
                bookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {filterBookings("pending").map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </TabsContent>

            <TabsContent value="accepted" className="space-y-4">
              {filterBookings("accepted").map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {filterBookings("completed").map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;