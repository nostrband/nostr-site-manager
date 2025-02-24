import { ChevronLeftIcon } from "@/components/Icons";
import {
  Box,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  StyledAuthorAvatar,
  StyledFormControl,
  StyledMenuItemContent,
  StyledSelectButton,
  StyledSelectButtonSubText,
  StyledSelectButtonText,
  StyledWrapAuthor,
} from "../../styled";
import { StyledTitle, StyledWrapBlock } from "../StartScreen/styled";
import { LIST_SITE_TYPES, RECOMMENDED_AUTHORS } from "@/consts";
import { TypeAuthor } from "@/types";
import { getRecomendAuthors } from "@/utils";
import { debounce } from "lodash";
import { searchProfiles } from "@/services/nostr/api";
import { detectContentType } from "@/services/nostr/onboard";
import { parseProfileEvent } from "@/services/nostr/nostr";

interface ChooseProfileProps {
  author: TypeAuthor;
  selectAuthor: (author: TypeAuthor) => void;
}

export const ChooseProfile = ({ author, selectAuthor }: ChooseProfileProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [authorList, setAuthorList] = useState<TypeAuthor[]>([]);
  const [authorRecomendList, setAuthorRecomendList] = useState<TypeAuthor[]>(
    []
  );
  const [isloading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const buttonRef = useRef<HTMLElement>(null);

  const authorListView = inputValue.length ? authorList : authorRecomendList;

  const fetchSearchResults = async (query: string): Promise<void> => {
    try {
      setLoading(true);

      const profiles = await searchProfiles(query);
      console.log("profiles", profiles);

      const parsedProfiles = profiles.map((profile) => ({
        pubkey: profile.pubkey,
        ...parseProfileEvent(profile.pubkey, profile),
      }));

      const profilesWithContentType = await Promise.all(
        parsedProfiles.map(async (profile) => {
          const [type, kinds] = await detectContentType(profile.pubkey);
          const typeSiteProfile =
            LIST_SITE_TYPES.find((el) => el.type === type) ??
            LIST_SITE_TYPES[0];
          return {
            ...profile,
            typename: typeSiteProfile.typename,
            type,
            kinds,
          };
        })
      );

      setAuthorList(profilesWithContentType);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useMemo(
    () => debounce((query: string) => fetchSearchResults(query), 300),
    []
  );

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value } = event.target;
    setInputValue(value);
    debouncedFetch(value);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectAuthor = (value: TypeAuthor) => {
    handleClose();
    selectAuthor(value);
  };

  useEffect(() => {
    getRecomendAuthors(RECOMMENDED_AUTHORS, setAuthorRecomendList);
  }, []);

  return (
    <>
      <StyledWrapBlock ref={buttonRef} id="basic-button">
        <StyledTitle>User Profile</StyledTitle>

        <Typography typography={"body2"}>
          Pre-populate the site with user&apos;s posts and profile data like name,
          icon and description. Can be adjusted later.
        </Typography>

        <StyledSelectButton
          onClick={handleClick}
          fullWidth
          endIcon={<ChevronLeftIcon />}
          isOpen={isOpen}
          color="secondary"
        >
          <StyledWrapAuthor>
            <StyledAuthorAvatar src={author.img} />
            <Box>
              <StyledSelectButtonText>{author.name}</StyledSelectButtonText>
              <StyledSelectButtonSubText variant="body2">
                {author.typename}
              </StyledSelectButtonSubText>
            </Box>
          </StyledWrapAuthor>
        </StyledSelectButton>
      </StyledWrapBlock>

      {buttonRef.current && (
        <Menu
          id="basic-menu"
          anchorEl={buttonRef.current}
          open={isOpen}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
            autoFocus: false,
          }}
          slotProps={{
            paper: {
              sx: {
                maxHeight: "280px",
                marginTop: "8px",
                width: buttonRef.current
                  ? buttonRef.current.offsetWidth
                  : "auto",
              },
            },
          }}
        >
          <StyledFormControl>
            <FormControl fullWidth size="small">
              <InputLabel htmlFor="author">Author</InputLabel>
              <OutlinedInput
                id="author"
                name="author"
                label="Author"
                onChange={handleInputChange}
                onKeyDown={(e) => e.stopPropagation()}
                value={inputValue}
                endAdornment={
                  isloading ? (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  ) : null
                }
              />
            </FormControl>
          </StyledFormControl>
          {authorListView.length ? (
            authorListView.map((el, i) => (
              <MenuItem key={i} onClick={() => handleSelectAuthor(el)}>
                <StyledMenuItemContent>
                  <StyledWrapAuthor>
                    <StyledAuthorAvatar src={el.img} />
                    <Box>
                      <StyledSelectButtonText>{el.name}</StyledSelectButtonText>
                      <StyledSelectButtonSubText variant="body2">
                        {el.typename}
                      </StyledSelectButtonSubText>
                    </Box>
                  </StyledWrapAuthor>
                </StyledMenuItemContent>
              </MenuItem>
            ))
          ) : (
            <StyledFormControl>No author found</StyledFormControl>
          )}
        </Menu>
      )}
    </>
  );
};
