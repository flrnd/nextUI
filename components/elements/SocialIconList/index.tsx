import classNames from "classnames";
import IconLink from "components/elements/IconLink";
import { getIcon } from "components/icons";
import { ISocial } from "lib/types";

interface IProps {
  items: ISocial[];
  margin?: string;
  justify?: "center" | "left" | "right" | "between";
}

const getJustify = (justify: IProps["justify"]) => {
  switch (justify) {
    case "center":
      return "justify-center";
    case "left":
      return "justify-start";
    case "right":
      return "justify-end";
    case "between":
      return "justify-between";
    default:
      return "justify-center";
  }
};

const SocialIconList = ({ items, margin, justify }: IProps): JSX.Element => {
  return (
    <div className={classNames("flex", "w-full", getJustify(justify))}>
      {items.map((item) => (
        <IconLink
          key={item.href}
          icon={getIcon(item.icon)}
          href={item.href}
          margin={margin}
        />
      ))}
    </div>
  );
};

export default SocialIconList;
