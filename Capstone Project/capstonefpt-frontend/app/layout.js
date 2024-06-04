import { Inter } from "next/font/google";
import "./globals.css";
import NavigationComponent from "@/components/navigation";
import { AuthProvider } from "@/contexts/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "School Medical Counseling Appointment System",
  description:
    "School Medical Counseling Appointment System capstone project SP24",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="flex">
            <NavigationComponent></NavigationComponent>
            {children}
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
