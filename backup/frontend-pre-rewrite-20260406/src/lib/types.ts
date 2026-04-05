export type CapsuleStatus = "collecting" | "sealed" | "opened";

export type Capsule = {
  id: string;
  title: string;
  creatorName: string;
  creatorEmail: string;
  openAt: string;
  status: CapsuleStatus;
  createdAt: string;
};

export type Contribution = {
  id: string;
  capsuleId: string;
  nickname: string;
  email: string;
  message: string | null;
  photos: string[];
  createdAt: string;
};

export type ContributionGroup = {
  id: string;
  nickname: string;
  email: string;
  contributions: Contribution[];
};
