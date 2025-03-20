import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function PaymentPage() {
  return (
    <div className="container mx-auto p-6 flex flex-col gap-6">
      <form>
        <div className="flex gap-6">
          {/* Payment Input Section */}
          <div className="w-2/3">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Full Name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Email Address" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" placeholder="Phone Number" />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="Address" />
                  </div>
                  <div>
                    <Label htmlFor="service">Service</Label>
                    <Select>
                      <SelectItem value="architecture">Architectural Design</SelectItem>
                      <SelectItem value="construction">Home Construction</SelectItem>
                      <SelectItem value="villa">Villa Development</SelectItem>
                      <SelectItem value="renovation">Renovation</SelectItem>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="orderCode">Order Code</Label>
                    <Input id="orderCode" placeholder="Order Code" />
                  </div>
                  <div>
                    <Label htmlFor="delivery">Delivery Method</Label>
                    <Select >
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" type="number" placeholder="Nominal Payment" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Section */}
          <div className="w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    Service Cost: <span className="font-bold">Rp XXX</span>
                  </p>
                  <p>
                    Admin Fee: <span className="font-bold">Rp 4000</span>
                  </p>
                  <p>
                    Total: <span className="font-bold">Rp XXX + 4000</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <Checkbox id="agree" />
                    <Label htmlFor="agree">
                      I agree to the{" "}
                      <Link href="/terms" passHref>
                        <a className="underline">Terms and Conditions</a>
                      </Link>
                    </Label>
                  </div>
                  <Button type="submit" className="w-full">
                    Pay
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* Payment Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            1. Introduction: By using POWER LANDMARK’s services, you agree to the Terms and Conditions.
            <br />
            2. Ordering: Contact admin for negotiation and order code.
            <br />
            3. Payment: Payment must be made within 30 minutes.
            <br />
            4. Delivery: Project begins after approval of design.
            <br />
            5. Refund: Cancellations require admin approval.
            <br />
            6. Privacy: Customer data is secure and not shared.
            <br />
            7. Security: Payments processed securely.
            <br />
            8. Additional Terms: Updates may occur.
            <br />
            9. Contact: Reach out via our website.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
