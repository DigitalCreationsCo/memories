import { ReactElement, ReactNode } from "react";
import { InputOutput } from "@/constants/enums";
// import {
//   APIClassType,
//   APITemplateType,
//   InputFieldType,
//   OutputFieldProxyType,
// } from "../api";

export type InputComponentType = {
  name?: string;
  autoFocus?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string, snapshot?: boolean) => void;
  password: boolean;
  required?: boolean;
  isForm?: boolean;
  editNode?: boolean;
  onChangePass?: (value: boolean | boolean) => void;
  showPass?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
  blurOnEnter?: boolean;
  optionsIcon?: string;
  optionsPlaceholder?: string;
  options?: string[];
  optionsButton?: ReactElement;
  optionButton?: (option: string) => ReactElement;
  selectedOption?: string;
  setSelectedOption?: (value: string) => void;
  selectedOptions?: string[];
  setSelectedOptions?: (value: string[]) => void;
  objectOptions?: Array<{ name: string; id: string }>;
  isObjectOption?: boolean;
  onChangeFolderName?: (e: any) => void;
  nodeStyle?: boolean;
  isToolMode?: boolean;
};
export type DropDownComponent = {
  disabled?: boolean;
  isLoading?: boolean;
  value: string;
  combobox?: boolean;
  options: string[];
  onSelect: (value: string, dbValue?: boolean, snapshot?: boolean) => void;
  editNode?: boolean;
  id?: string;
  children?: ReactNode;
  name?: string;
};

export type RangeSpecType = {
  min: number;
  max: number;
  step: number;
};

export type IntComponentType = {
  value: number;
  disabled?: boolean;
  rangeSpec: RangeSpecType;
  onChange: (value: number, dbValue?: boolean, skipSnapshot?: boolean) => void;
  editNode?: boolean;
  id?: string;
};

export type FloatComponentType = {
  value: string;
  disabled?: boolean;
  onChange: (
    value: string | number,
    dbValue?: boolean,
    skipSnapshot?: boolean,
  ) => void;
  rangeSpec: RangeSpecType;
  editNode?: boolean;
  id?: string;
};

export type SliderComponentType = {
  value: string;
  disabled?: boolean;
  rangeSpec: RangeSpecType;
  editNode?: boolean;
  id?: string;
  minLabel?: string;
  maxLabel?: string;
  minLabelIcon?: string;
  maxLabelIcon?: string;
  sliderButtons?: boolean;
  sliderButtonsOptions?: {
    label: string;
    id: number;
  }[];
  sliderInput?: boolean;
};

export type FilePreviewType = {
  loading: boolean;
  file: File;
  error: boolean;
  id: string;
  path?: string;
};

export type TooltipComponentType = {
  children: ReactElement;
  title: string | ReactElement;
  placement?:
    | "bottom-end"
    | "bottom-start"
    | "bottom"
    | "left-end"
    | "left-start"
    | "left"
    | "right-end"
    | "right-start"
    | "right"
    | "top-end"
    | "top-start"
    | "top";
};

export type ProgressBarType = {
  children?: ReactElement;
  value?: number;
  max?: number;
};

export type AccordionComponentType = {
  children?: ReactElement;
  open?: string[];
  trigger?: string | ReactElement;
  disabled?: boolean;
  keyValue?: string;
  openDisc?: boolean;
  sideBar?: boolean;
  options?: { title: string; icon: string }[];
};
export type Side = "top" | "right" | "bottom" | "left";

export type ShadTooltipProps = {
  delayDuration?: number;
  side?: Side;
  content: ReactNode;
  children: ReactNode;
  style?: string;
};
export type ShadToolTipType = {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  content?: ReactNode | null;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  asChild?: boolean;
  children?: ReactElement;
  delayDuration?: number;
  styleClasses?: string;
  avoidCollisions?: boolean;
};

export type TextHighlightType = {
  value?: string;
  side?: "top" | "right" | "bottom" | "left";
  asChild?: boolean;
  children?: ReactElement;
  delayDuration?: number;
};

export interface IVarHighlightType {
  name: string;
}

export type IconComponentProps = {
  name: string;
  className?: string;
  iconColor?: string;
  onClick?: () => void;
  stroke?: string;
  strokeWidth?: number;
  id?: string;
  skipFallback?: boolean;
  dataTestId?: string;
};

export type InputProps = {
  name: string | null;
  description: string | null;
  endpointName?: string | null;
  maxLength?: number;
  setName?: (name: string) => void;
  setDescription?: (description: string) => void;
  setEndpointName?: (endpointName: string) => void;
  invalidNameList?: string[];
};

export type TooltipProps = {
  selector: string;
  content?: string;
  disabled?: boolean;
  htmlContent?: React.ReactNode;
  className?: string; // This should use !impornant to override the default styles eg: '!bg-white'
  position?: "top" | "right" | "bottom" | "left";
  clickable?: boolean;
  children: React.ReactNode;
  delayShow?: number;
};

export type LoadingComponentProps = {
  remSize: number;
};

export type ContentProps = {
  children: ReactNode;
};
export type HeaderProps = { children: ReactNode; description: string };
export type TriggerProps = {
  children: ReactNode;
  tooltipContent?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
};

export interface languageMap {
  [key: string]: string | undefined;
}

export type signUpInputStateType = {
  password: string;
  cnfPassword: string;
  username: string;
};

export type inputHandlerEventType = {
  target: {
    value: string | boolean;
    name: string;
  };
};
export type PaginatorComponentType = {
  pageSize: number;
  pageIndex: number;
  rowsCount?: number[];
  totalRowsCount: number;
  paginate: (pageIndex: number, pageSize: number) => void;
  pages?: number;
  isComponent?: boolean;
};

export type ConfirmationModalType = {
  onCancel?: () => void;
  title: string;
  titleHeader?: string;
  destructive?: boolean;
  destructiveCancel?: boolean;
  modalContentTitle?: string;
  loading?: boolean;
  cancelText?: string;
  confirmationText?: string;
  children:
    | [React.ReactElement<ContentProps>, React.ReactElement<TriggerProps>]
    | React.ReactElement<ContentProps>;
  icon?: string;
  data?: any;
  index?: number;
  onConfirm?: (index: number, data: any) => void;
  open?: boolean;
  onClose?: () => void;
  size?:
    | "x-small"
    | "smaller"
    | "small"
    | "medium"
    | "large"
    | "large-h-full"
    | "small-h-full"
    | "medium-h-full";
  onEscapeKeyDown?: (e: KeyboardEvent) => void;
};

export type UserManagementType = {
  title: string;
  titleHeader: string;
  cancelText: string;
  confirmationText: string;
  children: ReactElement;
  icon: string;
  data?: any;
  index?: number;
  asChild?: boolean;
  onConfirm: (index: number, data: any) => void;
};

export type loginInputStateType = {
  username: string;
  password: string;
};

export type patchUserInputStateType = {
  password: string;
  cnfPassword: string;
  profilePicture: string;
  apikey: string;
  gradient?: any;
};

export type UserInputType = {
  username: string;
  password: string;
  is_active?: boolean;
  is_superuser?: boolean;
  id?: string;
  create_at?: string;
  updated_at?: string;
};

export type ApiKeyType = {
  children: ReactElement;
  data?: any;
  onCloseModal: () => void;
};

export type StoreApiKeyType = {
  children: ReactElement;
  disabled?: boolean;
};
export type groupedObjType = {
  family: string;
  type: string;
  display_name?: string;
};

export type nodeGroupedObjType = {
  displayName: string;
  node: string[] | string;
};

type test = {
  [char: string]: string;
};

export type apiModalTweakType = {
  current: Array<{
    [key: string]: {
      [char: string]: string | number;
    };
  }>;
};

export interface Props {
  language: string;
  value: string;
}

export type fileCardPropsType = {
  fileName: string;
  path: string;
  fileType: string;
  showFile?: boolean;
};

export type parsedDataType = {
  id: string;
  params: string;
  progress: number;
  valid: boolean;
};

export type SanitizedHTMLWrapperType = {
  content: string;
  suppressWarning?: boolean;
};

export type iconsType = {
  [key: string]: React.ElementType;
};

export type modalHeaderType = {
  children: ReactNode;
  description: string | JSX.Element | null;
};

export type genericModalPropsType = {
  field_name?: string;
  setValue: (value: string) => void;
  value: string;
  buttonText: string;
  modalTitle: string;
  type: number;
  disabled?: boolean;
  children: ReactNode;
  id?: string;
  readonly?: boolean;
  password?: boolean;
  changeVisibility?: () => void;
};

// export type PromptModalType = {
//   field_name?: string;
//   setValue: (value: string) => void;
//   value: string;
//   disabled?: boolean;
//   nodeClass?: APIClassType;
//   setNodeClass?: (Class: APIClassType, type?: string) => void;
//   children: ReactNode;
//   id?: string;
//   readonly?: boolean;
// };

export type textModalPropsType = {
  setValue: (value: string) => void;
  value: string;
  disabled?: boolean;
  children?: ReactNode;
  readonly?: boolean;
  password?: boolean;
  changeVisibility?: () => void;
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

export type newFlowModalPropsType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type IOModalPropsType = {
  children: JSX.Element;
  open: boolean;
  setOpen: (open: boolean) => void;
  disable?: boolean;
  isPlayground?: boolean;
  cleanOnClose?: boolean;
  canvasOpen?: boolean;
};

export type buttonBoxPropsType = {
  onClick: () => void;
  title: string;
  description: string;
  icon: ReactNode;
  bgColor: string;
  textColor: string;
  deactivate?: boolean;
  size: "small" | "medium" | "big";
};

export type FlowSettingsPropsType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type groupDataType = {
  [char: string]: string;
};

export type cardComponentPropsType = {
  data: any;
  onDelete?: () => void;
  button?: JSX.Element;
};

export type tabsArrayType = {
  code: string;
  image: string;
  language: string;
  mode: string;
  name: string;
  description?: string;
  hasTweaks?: boolean;
};

export type crashComponentPropsType = {
  error: {
    message: string;
    stack: string;
  };
  resetErrorBoundary: (args: any) => void;
};

export type Log = {
  message: string;
};

export type validationStatusType = {
  id: string;
  data: object | any;
  outputs: Log[];
  progress?: number;
  valid: boolean;
  duration?: string;
};

export type ApiKey = {
  id: string;
  api_key: string;
  name: string;
  created_at: string;
  last_used_at: string;
  total_uses: number;
};
export type fetchErrorComponentType = {
  message: string;
  description: string;
  openModal?: boolean;
  setRetry: () => void;
  isLoadingHealth: boolean;
};

export type dropdownButtonPropsType = {
  firstButtonName: string;
  onFirstBtnClick: () => void;
  options: Array<{ name: string; onBtnClick: () => void }>;
  plusButton?: boolean;
  dropdownOptions?: boolean;
  isFetchingFolders?: boolean;
};

export type IOFieldViewProps = {
  type: InputOutput;
  fieldType: string;
  fieldId: string;
  left?: boolean;
};

export type toolbarSelectItemProps = {
  value: string;
  icon: string;
  style?: string;
  dataTestId: string;
  ping?: boolean;
  shortcut: string;
};