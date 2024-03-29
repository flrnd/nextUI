import DashboardNavigationBar from "components/dashboard/DashboardNavigationBar";
import ProfilePanel from "components/dashboard/ProfilePanel";
import { selectUser } from "lib/features/user/userSlice";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Profile = (): JSX.Element => {
  const { session } = useSelector(selectUser);
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/signin");
    }
  }, [router, session]);

  const SideBar = (): JSX.Element => <div></div>;

  return (
    session && (
      <div className="dashboard">
        <DashboardNavigationBar />
        <main>
          <SideBar />
          <ProfilePanel />
        </main>
      </div>
    )
  );
};

export default Profile;
