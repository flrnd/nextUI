export interface INavigationListItem {
  name: string;
  href: string;
}

export interface IServiceListItem {
  name: string;
  description: string;
  icon: JSX.Element;
  href?: string;
}

export interface ISocial {
  icon: string;
  href: string;
}

export interface IContact {
  email: string;
  phone: string;
  address: string;
  hours: string;
}

export interface IList {
  list: Array<IListItem>;
}

export interface IListItem {
  title: string;
  value: string[];
  icon: string;
}

export interface IResponse {
  status: number;
  message?: string;
  token?: string;
}

export interface IFormData {
  username: string;
  password: string;
}

export interface IProfileData {
  firstName: string;
  lastName: string;
  billingAddress: string;
  avatar?: string;
}

export interface IFormDataMagicMail {
  email: string;
}

export interface IMessage {
  type?: string;
  content?: string;
}

export interface ProfileDetails {
  id: string /* primary key */;
  first_name: string;
  last_name: string;
  billing_address: string;
  avatar_url?: string;
}

export interface SiteConfig {
  id: string /* primary key */;
  user_id: string;
  data: JSON;
}
