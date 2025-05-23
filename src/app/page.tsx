import Image from "next/image";
import Dashboard from "@/app/dashboard/page";

export default function Home() {
  return (
    
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
       <Dashboard/>
      </main>
  
   
  );
}
