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

export type ParamsContextType = {
  allProducts: Product[];
  allPriorities: Priority[];
  allTypes: Type[];
  allStatuses: Status[];
  allUserRoles: UserRole[];
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export type AxiosLoginResponse = {
  data: { accessToken: string };
};

export type FiltersType = {
  product?: Product | undefined;
  priority?: Priority | undefined;
  type?: Type | undefined;
  status?: Status | undefined;
  searchString?: string | undefined;
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
  authRoles: number[];
  sublinks: {
    label: string;
    image: string;
    href: string;
    desc: string;
    authRoles: number[];
  }[];
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
  respRole: UserRole;
  type: Type;
  status: Status;
  priority: Priority;
  user: AuthUser;
  statusHistory: StatusHistory[];
  comments: Comments[];
};

export type StatusHistory = {
  createdAt: Date;
  user: AuthUser;
  status: Status;
  respRole: UserRole;
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

export type SelectorProperties = "product" | "type" | "status" | "priority";

export type ApiPageParams =
  | "MyIssues"
  | "Triage"
  | "Resolve"
  | "Admin"
  | "Dashboard";

export type PaginationType = {
  limit: 10 | 25 | 50 | 100;
  page: number;
  count: number;
};



export type ChartDataType = {
  key: string;
  value: number;
}[];

export type IssuesStatisticsType = {
issueStatusData: ChartDataType;
issuesRespRoleData: ChartDataType;
issuesProductData: ChartDataType;
issuesTypeData: ChartDataType;
};

