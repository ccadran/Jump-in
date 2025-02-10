// import { describe, it, expect, vi, afterEach } from "vitest";
// import { createSupabaseClient } from "../supabaseClient";

// describe("GET /api/guilds", () => {
//   afterEach(() => {
//     vi.restoreAllMocks();
//   });

//   it("GET /api/guilds (simulé avec plusieurs guildes)", async () => {
//     const supabase = createSupabaseClient();

//     // Simulation de la réponse de Supabase pour la récupération des guildes
//     const spy = vi.spyOn(supabase, "from").mockImplementation(
//       () =>
//         ({
//           select: vi.fn().mockResolvedValue({
//             data: [
//               {
//                 id: 1,
//                 name: "Guild 1",
//                 cover: "cover1.jpg",
//                 description: "Description 1",
//               },
//               {
//                 id: 2,
//                 name: "Guild 2",
//                 cover: "cover2.jpg",
//                 description: "Description 2",
//               },
//               {
//                 id: 3,
//                 name: "Guild 3",
//                 cover: "cover3.jpg",
//                 description: "Description 3",
//               },
//             ],
//             error: null,
//           }),
//         } as any)
//     );

//     // Simuler la requête GET pour récupérer toutes les guildes
//     const { data, error } = await supabase.from("guild").select("*");

//     // Vérification que la méthode "from" a bien été appelée
//     expect(spy).toHaveBeenCalled();

//     // Vérification que la méthode "select" a bien été appelée
//     expect(spy.mock.results[0].value.select).toHaveBeenCalled();

//     // Vérification que les données retournées sont les bonnes
//     expect(data).toBeDefined();
//     expect(data!.length).toBe(3); // Vérifie qu'il y a 3 guildes dans la réponse
//     expect(data![0]).toEqual({
//       id: 1,
//       name: "Guild 1",
//       cover: "cover1.jpg",
//       description: "Description 1",
//     });
//     expect(data![1]).toEqual({
//       id: 2,
//       name: "Guild 2",
//       cover: "cover2.jpg",
//       description: "Description 2",
//     });
//     expect(data![2]).toEqual({
//       id: 3,
//       name: "Guild 3",
//       cover: "cover3.jpg",
//       description: "Description 3",
//     });

//     // Vérifie qu'il n'y a pas d'erreur
//     expect(error).toBeNull();
//   });
// });
