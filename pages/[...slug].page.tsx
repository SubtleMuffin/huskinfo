import { GetStaticPaths, GetStaticProps } from "next";
import { getMDXComponent } from "mdx-bundler/client";
import { Spacer } from "@/components/Spacer";
import { contentMap, pages } from "@/content/map";
import { listToFilepath } from "@/lib/file/list-to-file";
import { getPage } from "@/lib/pages";
import { Category, Link } from "@/types/category";
import { Page } from "@/types/page";
import { NextSeo } from "next-seo";
import { Button } from "@/components/Button";
import { LinkSet } from "@/components/LinkSet";
import { dorms } from "@/content/housing";
import { ArticleHead } from "@/components/ArticleHead";
import { substitutedComponents } from "@/components/substitutedComponents";

export const getStaticPaths: GetStaticPaths = async () => {
  const categoryPaths = contentMap.map((category) => `/${category.slug}`);
  const otherPagePaths = pages;
  return {
    paths: [...categoryPaths, ...otherPagePaths],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slugList = params?.slug! as string[];
  const slug = listToFilepath(slugList);

  const backLink =
    slugList.length > 1 ? `/${listToFilepath(slugList.slice(0, -1))}` : "/";
  const backTitle =
    backLink == "/" ? "Links" : (await getPage(backLink)).frontmatter.title;

  // Get page
  const page = await getPage(slug);
  const { title, description, pageType } = page.frontmatter;

  /* 
  It's a category page if:
  - The slugList length is 1 
  - AND that one element in the slugList is a category slug
  */
  const isCategoryPage =
    slugList.length === 1 &&
    !!contentMap.find((category) => category.slug === slug);
  /*
  Even if it's not a category page, try finding the category for a page to find the back button text and link
  */
  const category =
    contentMap.find((category) => category.slug === slugList[0]) ?? null;

  /* Some pages, such as "category" or "dorm" pages contain the link set */
  const containsLinkSet = isCategoryPage || pageType == "dorm";
  let links = null;
  let pages = null;

  if (isCategoryPage) {
    // {links,pages} = category
    links = category?.links! ?? null;
    pages = category?.pages! ?? null;
  } else if (pageType == "dorm") {
    /* 
    The dorm slug is in the URL
    */
    const dormSlug = slugList[slugList.length - 1];
    links = dorms.find((dorm) => dorm.slug == dormSlug)?.links;
    pages = dorms.find((dorm) => dorm.slug == dormSlug)?.pages ?? null;
  }

  return {
    props: {
      backLink,
      backTitle,

      isCategoryPage,
      category,

      containsLinkSet,
      links,
      pages,

      page,
      title,
      description,
    },
  };
};

interface ContentPageProps {
  backLink: string;
  backTitle: string;

  isCategoryPage: boolean;
  category?: Category;

  containsLinkSet: boolean;
  links: Link[];
  pages?: Link[];

  page: Page;

  title: string;
  description: string;
}

const ContentPage = ({
  backLink,
  backTitle,

  containsLinkSet,
  links,
  pages,

  page,
  title,
  description,
}: ContentPageProps) => {
  let Markdown;
  if (page) {
    Markdown = getMDXComponent(page?.code);
  }

  return (
    <>
      <NextSeo title={title} description={description}></NextSeo>

      <ArticleHead
        backButtonHref={backLink}
        backButtonText={backTitle}
        title={title}
      ></ArticleHead>

      <article className="wrapper">
        {containsLinkSet && (
          <>
            <LinkSet
              showTitle={false}
              showFull
              links={links}
              pages={pages}
            ></LinkSet>
            <Spacer size="xl"></Spacer>
          </>
        )}

        {Markdown && (
          <div className="prose">
            <Markdown components={substitutedComponents}></Markdown>
          </div>
        )}

        <Spacer size="2xl"></Spacer>

        <div className="flex items-center space-x-base">
          <Button
            href={{
              pathname: "/contribute",
              query: { name: page.frontmatter.title },
            }}
            icon="pen"
            size="sm"
          >
            Edit
          </Button>
          <Button
            href={{
              pathname: "/contribute",
              query: { name: page.frontmatter.title, fixLinks: true },
            }}
            icon="bug"
            size="sm"
          >
            Links broken?
          </Button>
        </div>
      </article>
    </>
  );
};

export default ContentPage;
