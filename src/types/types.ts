export type AuthUser = {
  userId?: number;
  firstName: string;
  lastName: string;
  email: string;
  iat?: number;
  exp?: number;
  roles: { userRole: UserRole }[];
};

export type UserRole = {
  roleId: number;
  roleName: string;
};

export type LoginData = {
  type: "password" | "google";
  email?: string;
  password?: string;
  credential?: string;
};

export type AuthContextType = {
  authUser: AuthUser | null;
  setAuthUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  handleLogin: (data: LoginData) => Promise<void>;
  handleLogout: () => Promise<void>;
  handleRefreshToken: () => Promise<string | undefined>;
};

export type AxiosLoginResponse = {
  data: { accessToken: string };
};

export type Product = {
  productId?: number;
  productName: string;
};

export type NavbarLinks = {
  label: string;
  image: string;
  href: string;
  desc: string;
  minRole: number;
};

export type ModalProps = {
  onOK: () => void;
  onCancel: () => void;
  title: string;
  question: string;
};

export type Type = {
  typeId?: number;
  typeName: string;
};

export type Status = {
  statusId?: number;
  statusName: string;
};

export type Priority = {
  priorityId?: number;
  priorityName: string;
};

export type Issue = {
  issueId?: number;
  issueName: string;
  issueDesc: string;
  createdAt: Date;
  closedAt?: Date;
  product?: Product;
  type: Type;
  status: Status;
  priority: Priority;
  user: AuthUser;
  statusHistory: StatusHistory[];
  comments: Comments[];
};

export type StatusHistory = {
  statusHistoryId?: number;
  createdAt: Date;
  userId: AuthUser["userId"];
  statusId: Status["statusId"];
  issueId: Issue["issueId"];
};

export type Comments = {
  commentId?: number;
  commentText: string;
  createdAt: Date;
  user: AuthUser;
  issueId: Issue["issueId"];
  documents: Documents[];
};

export type Documents = {
  documentId?: number;
  documentUrl: string;
  commentId: Comments["commentId"];
};
