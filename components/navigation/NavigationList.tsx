import createNavigationList from "../../util/createNavigationList";
import NavigationListItem from "./NavigationListItem";

interface Props {
  isVertical?: boolean;
  list: string[];
}
const NavigationList = ({ isVertical = false, list }: Props): JSX.Element => {
  const navigationList = createNavigationList(list);

  return (
    <ul className={`flex ${isVertical && "flex-col"}`}>
      {navigationList.map((navItem) => (
        <NavigationListItem key={navItem.name} item={navItem} />
      ))}
    </ul>
  );
};

export default NavigationList;