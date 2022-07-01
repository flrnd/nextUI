import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../../../lib/util/supabase/supabase-client";
import {
  EnumAlert,
  IChangePasswordFormData,
  IProfileData,
  IProfileDetails,
} from "../../../../lib/types";
import { Heading } from "../../../typography";
import ChangePasswordForm from "../../../form/ChangePasswordForm";
import router from "next/router";
import classNames from "classnames";
import { validatePasswordStrength } from "../../../../lib/util";
import {
  useAppDispatch,
  useAppSelector,
  useNotification,
} from "../../../../lib/hooks";
import { updateUserProfile } from "../../../../lib/features/User";
import EditButton from "../../buttons/EditButton";
import SaveCancelButtons from "../../buttons/SaveCancelButtons";
import { Button } from "../../../controls";
import AlertNotification from "../../AlertNotification";

const ProfilePanel = (): JSX.Element => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [edit, setEdit] = useState(false);
  const { user, session, profileDetails } = useAppSelector(
    (state) => state.user
  );
  const [showNotification, notificationMessage, notification] =
    useNotification();
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const dispatch = useAppDispatch();

  const onSubmit = useCallback(
    (data: IProfileData) => {
      const updates: IProfileDetails = {
        id: user.id,
        first_name: data.firstName || firstName,
        last_name: data.lastName || lastName,
        company_name: data.companyName || companyName,
        avatar_url: data.avatar,
      };

      dispatch(updateUserProfile(updates));

      notification({ type: "success", content: "Profile updated." });
      setEdit(false);
      setShowChangePasswordForm(false);
    },
    [user.id, firstName, lastName, companyName, dispatch, notification]
  );

  useEffect(() => {
    if (!session) {
      router.replace("/signin");
    }
  }, [session]);

  useEffect(() => {
    setFirstName(profileDetails?.first_name);
    setLastName(profileDetails?.last_name);
    setCompanyName(profileDetails?.company_name);
  }, [
    profileDetails?.company_name,
    profileDetails?.first_name,
    profileDetails?.last_name,
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IProfileData>();

  const onSubmitChangePassword = useCallback(
    async (formData: IChangePasswordFormData) => {
      try {
        const passwordStrength = validatePasswordStrength(formData.newPassword);

        if (passwordStrength.validation) {
          const { data, error } = await supabase.rpc("change_user_password", {
            current_plain_password: formData.currentPassword,
            new_plain_password: formData.newPassword,
          });
          if (error) throw error;
          if (data) {
            notification({
              type: "success",
              content: "Password changed successfully",
            });
            setShowChangePasswordForm(false);
          }
        } else {
          notification({
            type: "error",
            content: passwordStrength.errors.join(", "),
          });
        }
      } catch (error) {
        notification({ type: "error", content: error.message });
        console.error("ChangePasswordForm - onSubmit(): ", error.message);
      }
    },
    [notification]
  );
  const handleChangePassword = () =>
    setShowChangePasswordForm(!showChangePasswordForm);

  const handleEdit = () => setEdit(!edit);
  const handleCancelOnClick = () => {
    setEdit(false);
    setShowChangePasswordForm(false);
  };

  return (
    <div className="mt-10">
      <div className="dashboard-panel">
        <div className="dashboard-panel-main-section">
          <Heading level={4} size="medium" margin="mb-4" weight="font-bold">
            Profile
          </Heading>
          {!edit && <EditButton onClick={handleEdit} />}
          {edit && (
            <SaveCancelButtons
              handleCancel={handleCancelOnClick}
              handleSave={handleSubmit(onSubmit)}
            />
          )}
        </div>

        <div className="panel max-w-lg mt-8">
          <div className="form-entry">
            <label className="form-label">
              First name
              {errors.firstName && (
                <span className="notification-red">* Missing First name</span>
              )}
            </label>
            <input
              className={classNames(
                "form-input",
                edit && "border border-gray-200 shadow",
                !edit && "border border-transparent"
              )}
              id="first_name"
              value={firstName || "Jane"}
              type="text"
              {...register("firstName", { required: false })}
              placeholder="Jane"
              onChange={(e) => setFirstName(e.target.value)}
              disabled={!edit}
            />
          </div>
          <div className="form-entry">
            <label className="form-label">
              Last name
              {errors.firstName && (
                <span className="notification-red">* Missing Last name</span>
              )}
            </label>
            <input
              className={classNames(
                "form-input",
                edit && "border border-gray-200 shadow",
                !edit && "border border-transparent"
              )}
              id="last_name"
              value={lastName || "Doe"}
              type="text"
              {...register("lastName", { required: false })}
              placeholder="Doe"
              onChange={(e) => setLastName(e.target.value)}
              disabled={!edit}
            />
          </div>
          <div className="form-entry">
            <label className="form-label">Company name</label>
            <input
              className={classNames(
                "form-input",
                edit && "border border-gray-200 shadow",
                !edit && "border border-transparent"
              )}
              id="company_name"
              value={companyName || "ACME Industries LTD"}
              type="text"
              {...register("companyName", { required: false })}
              placeholder="ACME Industries LTD"
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={!edit}
            />
          </div>
          <div className="form-entry">
            {!showChangePasswordForm && (
              <label className="form-label">Password</label>
            )}
            {!edit && (
              <input
                className="form-input"
                id="password"
                value={"*****************"}
                type="text"
                disabled={true}
              />
            )}
            {edit && !showChangePasswordForm && (
              <Button
                textColor="text-black"
                background="bg-white"
                rounded="rounded-md"
                shadow="shadow-sm"
                className="px-4 py-1 border-solid border-2 border-grey-200"
                hoverBg="shadow-md"
                type="button"
                onClick={handleChangePassword}
              >
                Change password
              </Button>
            )}
          </div>
          {edit && (
            <div className="mb-4">
              {showChangePasswordForm && (
                <div className="max-w-sm">
                  <ChangePasswordForm onSubmit={onSubmitChangePassword} />
                </div>
              )}
            </div>
          )}
        </div>
        <div className="notification">
          {showNotification && notificationMessage.type === "success" && (
            <AlertNotification
              text={notificationMessage.content}
              alertType={EnumAlert.Success}
            />
          )}
          {showNotification && notificationMessage.type === "error" && (
            <AlertNotification
              text={notificationMessage.content}
              alertType={EnumAlert.Danger}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;