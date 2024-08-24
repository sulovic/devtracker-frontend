export type AuthUser = {
  firstName: string;
  lastName: string;
  email: string;
  iat: number;
  exp: number;
  roles: {
    roleId: number;
    userId: number;
  }[];
};

export type UserRole = {
  roleId: number;
  roleName: string;
};

export type User = {
  userId?: number;
  firstName: string;
  lastName: string;
  email: string;
  roles?: {
     userRoles: UserRole;
  }[];
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
  productId: number | null;
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

export type IssueType = {
  typeId: number | null;
  typeName: string;
};

export type IssueStatus = { 
  statusId: number | null;
  statusName: string;
}

export type Issue =   {
  issueId: number | null;
  issueName: string;
  issueDesc: string;
  createdAt: Date;
  closedAt: Date;
  productId : Product['productId'];
  typeId: IssueType['typeId'];
  statusId: IssueStatus['statusId'];
  statusHistory : StatusHistory[]
  comments: Comments[]
}

export type StatusHistory = {
  statusHistoryId: number | null;
  createdAt: Date;
  userId: User['userId'];
  statusId  : IssueStatus['statusId'];
  issueId: Issue['issueId'];
}

export type Comments = {
  commentId: number | null;
  commentText: string;
  createdAt: Date;
  userId: User['userId'];
  issueId: Issue['issueId'];
  documents: Documents[]
}

export type Documents = {
  documentId: number | null;
  documentUrl: string;
  commentId: Comments['commentId'];
}
