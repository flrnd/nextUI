import classNames from "classnames";

import NavigationItem from "components/navigation/NavigationItem";
import { createNavigationList } from "lib/util";

interface Props {
  isVertical?: boolean;
  list: string[];
}

const NavigationItemList = ({
  isVertical = false,
  list,
}: Props): JSX.Element => {
  const navigationList = createNavigationList(list);

  return (
    <ul
      aria-label="navigation-list"
      className={classNames("flex", isVertical && "flex-col")}
    >
      {navigationList.map((navItem) => (
        <NavigationItem key={navItem.name} item={navItem} />
      ))}
    </ul>
  );
};

export default NavigationItemList;
