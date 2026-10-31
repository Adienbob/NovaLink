import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
return ( 

   <div className="space-y-6"> 
      <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">         
         <UserProfile
         routing="hash"
         appearance={{
            elements: {
               rootBox: "w-full",
               cardBox: "w-full max-w-none shadow-none border-0",
               navbar: "hidden",
               pageScrollBox: "p-0",
            },
         }}
         />
      </div>
   </div>

   );
}
