import filesJson from "../../../Public/ProfileImage.files.json";

const { otherImgs, statusImgs } = filesJson as {
  otherImgs: Record<string, string>;
  statusImgs: Record<string, string>;
};

export { otherImgs, statusImgs };
export const alphaValue = 0.4;
export const clydeID = "1081004946872352958";
