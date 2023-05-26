export const colorPallate = [
  {
    backgroundColor: "#EEA16F",
    textColor: "white"
  },
  {
    backgroundColor: "#AECFB2",
    textColor: "white"
  },
  {
    backgroundColor: "#AD9ECD",
    textColor: "white"
  },
  {
    backgroundColor: "#EE9AB3",
    textColor: "white"
  },
  {
    backgroundColor: "#9BB0D5",
    textColor: "white"
  },
  {
    backgroundColor: "#C8AF9B",
    textColor: "white"
  },
  {
    backgroundColor: "#B8C6C8",
    textColor: "white"
  },
  {
    backgroundColor: "#AB96A0",
    textColor: "white"
  },
  {
    backgroundColor: "#C8C372",
    textColor: "white"
  },
  {
    backgroundColor: "#C580CB",
    textColor: "white"
  }
];

export const gapPeriodColor = "rgba(207,217,235,0.96)";

export const getColorForIndex = index => {
  return colorPallate[index % colorPallate.length];
};
