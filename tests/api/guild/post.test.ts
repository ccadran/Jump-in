// import { describe, it, expect, vi, afterEach } from "vitest";
// import { createSupabaseClient } from "../supabaseClient";

// describe("POST /api/guild", () => {
//   afterEach(() => {
//     vi.restoreAllMocks();
//   });

//   it("POST /api/test (simulé)", async () => {
//     const supabase = createSupabaseClient();
//     // Espionner la méthode "from"
//     const spy = vi.spyOn(supabase, "from").mockImplementation(
//       () =>
//         ({
//           insert: vi.fn().mockResolvedValue({
//             data: [
//               {
//                 name: "Guild Test",
//                 cover: "cover.jpg",
//                 description: "Description Test",
//               },
//             ],
//             error: null,
//           }),
//           select: vi.fn(),
//         } as any)
//     );

//     // Simuler l'insertion
//     const { data, error } = await supabase.from("guild").insert({
//       name: "Guild Test",
//       cover: "cover.jpg",
//       description: "Description Test",
//     });

//     expect(spy).toHaveBeenCalled();
//     expect(data).toBeDefined();
//     expect(error).toBeNull();
//   });
// });
