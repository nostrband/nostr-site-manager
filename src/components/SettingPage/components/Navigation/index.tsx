import React, { useState } from "react";
import {
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "@/components/SettingPage/styled";
import {
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
  Tab,
  Fab,
  Button,
} from "@mui/material";
import {
  DragDropContext,
  Droppable,
  DropResult,
  Draggable,
} from "@hello-pangea/dnd";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { SaveButton } from "@/components/SettingPage/components/SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import { HASH_CONFIG } from "@/consts";
import { StyledItemNavigation } from "@/components/SettingPage/components/Navigation/styled";
import { reorder } from "./helpers";
import DehazeOutlinedIcon from "@mui/icons-material/DehazeOutlined";

export type NavigationModelType = {
  primary: { title: string; link: string; id: string }[];
  secondary: { title: string; link: string; id: string }[];
};

interface ITitleDescription extends IBaseSetting {
  navigation: NavigationModelType;
  handleChangeNavigation: (input: {
    id: string;
    type: "primary" | "secondary";
    field: "title" | "link";
    value: string;
  }) => void;
  handleAddLinkNavigation: (type: "primary" | "secondary") => void;
  handleChangeNavigationOrder: (navigation: NavigationModelType) => void;
  handleRemoveLinkNavigation: (input: {
    id: string;
    type: "primary" | "secondary";
  }) => void;
}

export const Navigation = ({
  navigation,
  handleChangeNavigation,
  handleChangeNavigationOrder,
  handleAddLinkNavigation,
  submitForm,
  isLoading,
  handleRemoveLinkNavigation,
}: ITitleDescription) => {
  const [isEdit, handleAction] = useEditSettingMode(submitForm, isLoading);
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const onDragEndPrimary = ({ destination, source }: DropResult) => {
    if (!destination) return;

    const newItems = reorder(
      navigation.primary,
      source.index,
      destination.index,
    );

    handleChangeNavigationOrder({ ...navigation, primary: newItems });
  };

  return (
    <StyledSettingCol id={HASH_CONFIG.NAVIGATION}>
      <StyledSettingBlock>
        <StyledHeadSettingBlock>
          <Typography variant="h6">Navigation</Typography>

          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleAction}
          />
        </StyledHeadSettingBlock>

        <Typography variant="body2" sx={{ mb: 3 }}>
          Primary & secondary site navigation
        </Typography>

        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Primary" value="1" />
              {/* <Tab label="Secondary" value="2" /> */}
            </TabList>
          </Box>
          <TabPanel sx={{ paddingLeft: 0, paddingRight: 0 }} value="1">
            <DragDropContext onDragEnd={onDragEndPrimary}>
              <Droppable droppableId="droppable-list">
                {(provided) => (
                  <Box ref={provided.innerRef} {...provided.droppableProps}>
                    {navigation &&
                      navigation.primary.map((el, i) => {
                        return (
                          <Draggable
                            isDragDisabled={!isEdit}
                            key={el.id}
                            draggableId={el.id}
                            index={i}
                          >
                            {(providedItem, snapshot) => (
                              <StyledItemNavigation
                                ref={providedItem.innerRef}
                                {...providedItem.draggableProps}
                                {...providedItem.dragHandleProps}
                                sx={{
                                  cursor: isEdit ? "grab" : "default",
                                  opacity: snapshot.isDragging ? "0.5" : "1",
                                }}
                              >
                                {isEdit && <DehazeOutlinedIcon />}
                                <FormControl
                                  disabled={!isEdit}
                                  fullWidth
                                  size="small"
                                >
                                  <InputLabel htmlFor="title">
                                    Title link
                                  </InputLabel>
                                  <OutlinedInput
                                    id="title"
                                    name="title"
                                    label="Title link"
                                    onChange={(e) =>
                                      handleChangeNavigation({
                                        id: el.id,
                                        field: "title",
                                        type: "primary",
                                        value: e.target.value,
                                      })
                                    }
                                    value={el.title}
                                  />
                                </FormControl>
                                <FormControl
                                  disabled={!isEdit}
                                  fullWidth
                                  size="small"
                                >
                                  <InputLabel htmlFor="link">Link</InputLabel>
                                  <OutlinedInput
                                    id="link"
                                    name="link"
                                    label="Link"
                                    onChange={(e) =>
                                      handleChangeNavigation({
                                        id: el.id,
                                        field: "link",
                                        type: "primary",
                                        value: e.target.value,
                                      })
                                    }
                                    value={el.link}
                                  />
                                </FormControl>
                                <Fab
                                  disabled={!isEdit}
                                  size="small"
                                  sx={{ width: "100%", maxWidth: "40px" }}
                                  color="error"
                                  onClick={() =>
                                    handleRemoveLinkNavigation({
                                      id: el.id,
                                      type: "primary",
                                    })
                                  }
                                >
                                  <DeleteTwoToneIcon />
                                </Fab>
                              </StyledItemNavigation>
                            )}
                          </Draggable>
                        );
                      })}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>

            {isEdit && (
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleAddLinkNavigation("primary")}
              >
                add
              </Button>
            )}
          </TabPanel>
          <TabPanel value="2">
            {navigation &&
              navigation.secondary.map((el, i) => {
                return (
                  <StyledItemNavigation key={i}>
                    <FormControl disabled={!isEdit} fullWidth size="small">
                      <InputLabel htmlFor="title">Title link</InputLabel>
                      <OutlinedInput
                        id="title"
                        name="title"
                        label="Title link"
                        onChange={(e) =>
                          handleChangeNavigation({
                            id: el.id,
                            field: "title",
                            type: "secondary",
                            value: e.target.value,
                          })
                        }
                        value={el.title}
                      />
                    </FormControl>
                    <FormControl disabled={!isEdit} fullWidth size="small">
                      <InputLabel htmlFor="link">Link</InputLabel>
                      <OutlinedInput
                        id="link"
                        name="link"
                        label="Link"
                        onChange={(e) =>
                          handleChangeNavigation({
                            id: el.id,
                            field: "link",
                            type: "secondary",
                            value: e.target.value,
                          })
                        }
                        value={el.link}
                      />
                    </FormControl>

                    <Fab
                      disabled={!isEdit}
                      size="small"
                      color="error"
                      sx={{ width: "100%", maxWidth: "40px" }}
                      onClick={() =>
                        handleRemoveLinkNavigation({
                          id: el.id,
                          type: "secondary",
                        })
                      }
                    >
                      <DeleteTwoToneIcon />
                    </Fab>
                  </StyledItemNavigation>
                );
              })}
            {isEdit && (
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleAddLinkNavigation("secondary")}
              >
                add
              </Button>
            )}
          </TabPanel>
        </TabContext>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
