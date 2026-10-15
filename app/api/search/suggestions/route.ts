import { getSearchSuggestions } from "@/features/catalog/search/queries/get-search-suggest";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

   if (query.length < 2) {
      return NextResponse.json({ suggestions: [] });
   }

   if (query.length > 100) {
      return NextResponse.json(
         { error: "Search query is too long." },
         { status: 400 }
      );
   }

   try {
      const suggestions = await getSearchSuggestions(query);

      return NextResponse.json(
         { suggestions },
         {
            headers: {
               "Cache-Control": "no-store",
            },
         }
      );
   } catch (error) {
      console.error("Search suggestions error:", error);

      return NextResponse.json(
         { error: "Failed to load search suggestions." },
         { status: 500 }
      );
   }
}