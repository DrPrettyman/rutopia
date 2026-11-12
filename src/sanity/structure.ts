import type { StructureResolver } from "sanity/structure";

/** Studio sidebar: Libraries → Series → Comics, plus browsing comics by series. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Rutopia")
    .items([
      S.documentTypeListItem("library").title("Libraries"),
      S.documentTypeListItem("series").title("Series"),
      S.listItem()
        .title("Comics by series")
        .child(
          S.documentTypeList("series")
            .title("Pick a series")
            .child((seriesId) =>
              S.documentList()
                .title("Comics")
                .filter('_type == "comic" && series._ref == $seriesId')
                .params({ seriesId })
                .initialValueTemplates([S.initialValueTemplateItem("comic-in-series", { seriesId })]),
            ),
        ),
      S.documentTypeListItem("comic").title("All comics"),
    ]);
