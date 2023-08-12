const ReactSelectTheme = () => ({
  control: (base: any) => ({
    ...base,
    height: "40px",
    minHeight: "40px",
    backgroundColor: "transparent",
    borderColor: "#26243F",
    boxShadow: null,
    flexWrap: "nowrap",
    borderRadius: 12,
    color: "white",
    ":active": {
      ...base[":active"],
      color: "white",
      backgroundColor: "#1B4965",
    },
  }),
  valueContainer: (base: any) => ({
    ...base,
    height: "40px",
    minHeight: "40px",
    padding: "0 6px",
    flexWrap: "nowrap",
  }),
  indicatorsContainer: (base: any) => ({
    ...base,
    height: "40px",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#151423",
  }),
  option: (base: any, { isFocused }: { isFocused: boolean }) => {
    return {
      ...base,
      backgroundColor: isFocused && "#1B4965",
      color: isFocused && "#151423",
      borderRadius: 12,
      cursor: "pointer",
      ":active": {
        ...base[":active"],
        backgroundColor: "#1B4965",
        color: "#1E1E1E",
      },
    };
  },
  menu: (base: any) => ({
    ...base,
    zIndex: 9999,
    backgroundColor: "#151423",
    borderRadius: 12,
    marginTop: 10,
  }),
  menuList: (base: any) => ({
    ...base,
    padding: 10,
  }),

  multiValue: (base: any) => {
    return {
      ...base,
      backgroundColor: "#1B4965",
    };
  },
  multiValueLabel: () => ({
    color: "white",
  }),
  multiValueRemove: () => ({
    color: "white",
    ":hover": {
      backgroundColor: "red",
      color: "white",
    },
  }),
});

export default ReactSelectTheme;
