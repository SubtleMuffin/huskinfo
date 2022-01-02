import { GetStaticPaths, GetStaticProps } from "next";
import { getMDXComponent } from "mdx-bundler/client";
import { CategorySet } from "@/components/CategorySet";
import { Spacer } from "@/components/Spacer";
import { Title } from "@/components/title";
import { contentMap, pages } from "@/content/map";
import { listToFilepath } from "@/lib/file/list-to-file";
import { getPage } from "@/lib/pages";
import { Category } from "@/types/category";
import { Page } from "@/types/page";
import { BackButton } from "@/components/BackButton";
import { NextSeo } from "next-seo";
import { Block } from "@/components/Block";
import clsx from "clsx";

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

  // Check if slug is the category. If so, the entire page is a category)
  let category;
  const isCategoryPage = slugList.length === 1;

  category =
    contentMap.find((category) => category.slug === slugList[0]) ?? null;

  // Get page
  const page = await getPage(slug);

  return {
    props: {
      isCategoryPage,
      category,
      page,
    },
  };
};

interface ContentPageProps {
  isCategoryPage: boolean;
  category: Category;
  page: Page;
}

const ContentPage = ({ isCategoryPage, category, page }: ContentPageProps) => {
  const Markdown = getMDXComponent(page.code);
  const { title, description, updatedAt } = page.frontmatter;

  return (
    <>
      <NextSeo title={title} description={description}></NextSeo>

      <Spacer></Spacer>

      {isCategoryPage ? (
        <BackButton></BackButton>
      ) : (
        <BackButton href={`/${category.slug}`}>{category.title}</BackButton>
      )}

      <Spacer size="sm"></Spacer>
      <Title>{title}</Title>
      <Spacer></Spacer>
      {isCategoryPage && (
        <CategorySet
          category={category!}
          showTitle={false}
          showFull
        ></CategorySet>
      )}

      <article className="prose">
        <Markdown
          components={{
            Block,
            a: ({ className, ...props }) => {
              return (
                <a {...props} className={clsx(className, "underline")}></a>
              );
            },
          }}
        ></Markdown>
      </article>
    </>
  );
};

export default ContentPage;
