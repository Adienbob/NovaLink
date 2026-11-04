function specsArrayToRecord(arr: { key: string; value: string }[]) {
   const result: Record<string, unknown> = {};

   for (const item of arr) {
      if (!item.key.trim()) continue;

      const val = item.value.trim();

      // try to convert to proper types
      if (val === "true") result[item.key] = true;
      else if (val === "false") result[item.key] = false;
      else if (val !== "" && !isNaN(Number(val))) result[item.key] = Number(val);
      else result[item.key] = val;
   }

   return result;
}