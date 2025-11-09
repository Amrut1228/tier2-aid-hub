import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, CheckCircle, XCircle, TrendingUp, Users, Star } from "lucide-react";
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
  };
}

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, earnings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkProviderAccess();
  }, []);

  const checkProviderAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    // Check if user is a provider
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "provider")
      .single();

    if (!roleData) {
      toast({
        title: "Access Denied",
        description: "You need provider access to view this page",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    fetchProviderData(user.id);
  };

  const fetchProviderData = async (userId: string) => {
    setLoading(true);
    
    // Get provider's service offerings
    const { data: providerData } = await supabase
      .from("service_providers")
      .select("id")
      .eq("user_id", userId);

    if (!providerData || providerData.length === 0) {
      setLoading(false);
      return;
    }

    const providerIds = providerData.map(p => p.id);

    // Fetch bookings
    const { data: bookingsData, error } = await supabase
      .from("bookings")
      .select(`
        *,
        services (name)
      `)
      .in("provider_id", providerIds)
      .order("scheduled_date", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error);
    } else {
      setBookings(bookingsData || []);
      
      // Calculate stats
      const total = bookingsData?.length || 0;
      const pending = bookingsData?.filter(b => b.status === "pending").length || 0;
      const earnings = bookingsData
        ?.filter(b => b.status === "completed")
        .reduce((sum, b) => sum + Number(b.total_price), 0) || 0;
      
      setStats({ total, pending, earnings });
    }
    
    setLoading(false);
  };

  const updateBookingStatus = async (bookingId: string, status: "accepted" | "completed") => {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", bookingId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Booking ${status} successfully`,
      });
      const { data: { user } } = await supabase.auth.getUser();
      if (user) fetchProviderData(user.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Provider Dashboard</h1>

        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.earnings}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Recent Bookings</h2>
          
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No bookings yet</p>
              </CardContent>
            </Card>
          ) : (
            bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{booking.services.name}</CardTitle>
                      <CardDescription>{booking.customer_name}</CardDescription>
                    </div>
                    <Badge variant={booking.status === "pending" ? "secondary" : "default"}>
                      {booking.status}
                    </Badge>
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
                    <span>{booking.address}, {booking.city}</span>
                  </div>
                  {booking.notes && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">Note: {booking.notes}</p>
                    </div>
                  )}
                  <div className="pt-2 border-t">
                    <p className="text-lg font-semibold text-primary">₹{booking.total_price}</p>
                  </div>
                  
                  {booking.status === "pending" && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => updateBookingStatus(booking.id, "accepted")}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                    </div>
                  )}
                  
                  {booking.status === "accepted" && (
                    <Button
                      size="sm"
                      onClick={() => updateBookingStatus(booking.id, "completed")}
                      className="w-full"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Complete
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;