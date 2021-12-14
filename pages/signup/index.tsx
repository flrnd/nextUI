import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, Logo } from "../../components/elements";
import LoginForm from "../../components/form/LoginForm";
import { Container } from "../../components/layout";
import { Heading } from "../../components/typography";
import { useUser } from "../../lib/store/hooks/useUser";
import { IFormData, IMessage } from "../../lib/types";
import { User } from "@supabase/gotrue-js";

const SignUp = (): JSX.Element => {
  const [newUser, setNewUser] = useState<User | null>(null);
  const [message, setMessage] = useState<IMessage>({ type: "", content: "" });
  const { user, signUp } = useUser();
  const router = useRouter();

  const onSubmit = async (data: IFormData) => {
    const { error, user: createdUser } = await signUp({
      email: data.username,
      password: data.password,
    });

    if (error) {
      setMessage({ type: "error", content: error.message });
    } else {
      if (createdUser) {
        setNewUser(createdUser);
      } else {
        setMessage({
          type: "note",
          content: "Check your mail for instructions.",
        });
      }
    }
  };

  useEffect(() => {
    (newUser || user) && router.replace("/dashboard/profile");
  }, [newUser, user]);

  if (!user) {
    return (
      <>
        <Container>
          <Card
            padding="px-4 pt-8"
            shadow="shadow-none"
            rounded="rounded-none"
            margin="mx-auto"
            height="h-screen"
          >
            <>
              <Link href="/" passHref>
                <a>
                  <Logo
                    responsive={false}
                    boxWidth="w-40"
                    margin="mx-auto"
                    padding="py-2"
                    src="/assets/pictures/brand/vitary-logo.png"
                    width={237}
                    height={64}
                  />
                </a>
              </Link>
            </>
            <div className="mt-8">
              <Heading level={3} margin="mb-2" size="normal">
                Sign up form
              </Heading>
              <p className="mt-2 text-sm">
                Enter a valid email address as username and password.
              </p>
            </div>
            {message.type === "error" && (
              <div
                id="error"
                className="mt-8 text-red-600 border border-red-600 p-4"
              >
                {message.content}
              </div>
            )}
            {message.type === "note" && (
              <div
                id="note"
                className="mt-8 text-green-600 border border-green-600 p-4"
              >
                {message.content}
              </div>
            )}
            <div className="mt-8">
              <LoginForm onSubmit={onSubmit} submitLabel="Sign Up" />
            </div>
            <div className="flex items-center justify-between">
              <Link href="/forgot-password" passHref>
                <a className="inline-block align-baseline text-sm text-indigo-500 hover:text-indigo-800">
                  Forgot your Password?
                </a>
              </Link>
              <span className="text-indigo-500">|</span>
              <Link href="/signin" passHref>
                <a className="inline-block align-baseline text-sm text-indigo-500 hover:text-indigo-800">
                  Sign In
                </a>
              </Link>
            </div>
          </Card>
        </Container>
      </>
    );
  }

  return <></>;
};

export default SignUp;