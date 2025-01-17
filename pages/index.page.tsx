import { contentMap } from "@/content/map";

import { LinkSet } from "@/components/LinkSet";
import { Expandable } from "@/components/Expandable";
import { Button } from "@/components/Button";

const IndexPage = () => {
  return (
    <>
      <article className="mt-base wrapper">
        {/* <Expandable
          title="Would you like to contribute to Husker?"
          containsProse
        >
          <p>
            We are looking to add more content to Husker! Would you like to
            write guides? Do you think your knowledge on the school can help
            others? Click the button below to contribute!
          </p>

          <div className="flex gap-base">
            <Button href="/contribute">Contribute</Button>
            <Button href="https://discord.gg/j7WkFct2rY" icon="discord">
              Discord
            </Button>
          </div>
        </Expandable> */}

        <div className="space-y-xl">
          {contentMap.map((category) => {
            return (
              <LinkSet
                key={category.slug}
                showTitle
                title={category.title}
                moreInfoHref={`/${category.slug}`}
                links={category.links}
              ></LinkSet>
            );
          })}
        </div>
      </article>
    </>
  );
};

export default IndexPage;
