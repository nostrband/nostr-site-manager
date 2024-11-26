import {
  Autocomplete,
  FilterOptionsState,
  ListItem,
  Divider,
  Box,
} from "@mui/material";
import {
  CustomPopper,
  StyledDivider,
  StyledFormControl,
  StyledListItemDescription,
  StyledListItemIcon,
  StyledListItemTitle,
  StyledListItemWrap,
  StyledListSubheader,
  StyledStartIcon,
  StyledTextField,
} from "./styled";
import { FC, SyntheticEvent, useState } from "react";
import { SearchIcon } from "@/components/Icons";
import { SETTINGS_CONFIG } from "@/consts";
import useResponsive from "@/hooks/useResponsive";
import { highlightMatch } from "./utils";

export interface Setting {
  title: string;
  description: string;
  anchor: string;
  icon: React.ReactNode;
  group: string;
  index?: number;
  isComingSoon?: boolean;
}

interface SearchSettingsFieldProps {
  choiceSetting: Setting | null;
  handleChoiceSetting: (setting: Setting | null) => void;
}

const options = Object.values(SETTINGS_CONFIG);

export const SearchSettingsField: FC<SearchSettingsFieldProps> = ({
  choiceSetting,
  handleChoiceSetting,
}) => {
  const [isFocus, setFocus] = useState(true);
  const [value, setValue] = useState("");
  const isValue = Boolean(choiceSetting);

  const isStartIcon = !isValue;

  const isDesktop = useResponsive("up", "sm");
  const sizeField = isDesktop ? "medium" : "small";

  const handleSetFocus = () => {
    setFocus((prev) => !prev);
  };

  const handleChoice = (
    _: SyntheticEvent<Element, Event>,
    setting: Setting | null,
  ) => {
    setValue("");

    handleChoiceSetting(setting);
  };

  const filterOptions = (
    options: Setting[],
    state: FilterOptionsState<Setting>,
  ): Setting[] => {
    const lowercasedInput = state.inputValue.toLowerCase();

    return options.filter(
      (option) =>
        option.title.toLowerCase().includes(lowercasedInput) ||
        option.description.toLowerCase().includes(lowercasedInput),
    );
  };

  const groupBy = (option: Setting) => option.group;

  return (
    <StyledFormControl>
      {isStartIcon && isFocus && (
        <StyledStartIcon>
          <SearchIcon />
        </StyledStartIcon>
      )}

      <Autocomplete
        blurOnSelect
        disablePortal
        options={options}
        size={sizeField}
        value={null}
        onChange={handleChoice}
        filterOptions={filterOptions}
        getOptionLabel={(option) => option.title}
        PopperComponent={(props) => <CustomPopper {...props} />}
        groupBy={groupBy}
        renderOption={(props, option, state) => {
          const query = state.inputValue;
          const title = highlightMatch(option.title, query);
          const description = highlightMatch(option.description, query);

          return (
            <ListItem {...props} key={option.title}>
              <StyledListItemWrap>
                <StyledListItemIcon>{option.icon}</StyledListItemIcon>
                <Box>
                  <StyledListItemTitle
                    sx={{
                      color: option.isComingSoon ? "rgba(0, 0, 0, 0.38)" : "",
                    }}
                  >
                    {title}
                  </StyledListItemTitle>
                  {Boolean(value.length) && (
                    <StyledListItemDescription variant="body2">
                      {description}
                    </StyledListItemDescription>
                  )}
                </Box>
              </StyledListItemWrap>
            </ListItem>
          );
        }}
        renderGroup={(group) => {
          return (
            <div key={group.key}>
              {Number(group.key) > 0 && (
                <StyledDivider>
                  <Divider />
                </StyledDivider>
              )}

              <StyledListSubheader>{group.group}</StyledListSubheader>

              {group.children}
            </div>
          );
        }}
        renderInput={(params) => (
          <StyledTextField
            {...params}
            variant="outlined"
            label="Search settings"
            onFocus={handleSetFocus}
            onBlur={handleSetFocus}
            isFocus={isStartIcon && isFocus}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )}
      />
    </StyledFormControl>
  );
};
