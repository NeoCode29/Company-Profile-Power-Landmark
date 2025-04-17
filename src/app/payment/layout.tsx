import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function PaymentLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="font-sans">
        <Header/>
        {children}
        <Footer/>
      </div>
    );
  }
  