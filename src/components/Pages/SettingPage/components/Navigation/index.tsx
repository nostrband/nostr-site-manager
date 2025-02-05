import React, { memo } from "react";
import {
  StyledDescriptionBlock,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledTitleBlock,
} from "../../styled";
import { Button } from "@mui/material";
import {
  DragDropContext,
  Droppable,
  DropResult,
  Draggable,
} from "@hello-pangea/dnd";
import { SaveButton } from "../SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import {
  IBaseSetting,
  InputNavigation,
  InputNavigationReset,
} from "@/types/setting.types";
import { SETTINGS_CONFIG } from "@/consts";
import {
  StyledItemNavigation,
  StyledNavigationWrap,
} from "../Navigation/styled";
import { reorder } from "./helpers";
import { ItemNavigation } from "./components/ItemNavigation";
import { PlusCircleIcon } from "@/components/Icons";

export type NavigationModelType = {
  primary: { title: string; link: string; id: string }[];
  secondary: { title: string; link: string; id: string }[];
};

interface ITitleDescription extends IBaseSetting {
  navigation: NavigationModelType;
  handleChangeNavigation: (input: InputNavigation) => void;
  handleResetNavigation: (input: InputNavigationReset) => void;
  handleAddLinkNavigation: (type: "primary" | "secondary") => void;
  handleChangeNavigationOrder: (navigation: NavigationModelType) => void;
  handleRemoveLinkNavigation: (input: {
    id: string;
    type: "primary" | "secondary";
  }) => void;
}

export const Navigation = memo(
  ({
    navigation,
    handleChangeNavigation,
    handleChangeNavigationOrder,
    handleAddLinkNavigation,
    handleResetNavigation,
    submitForm,
    isLoading,
    handleRemoveLinkNavigation,
  }: ITitleDescription) => {
    const [isEdit, handleAction] = useEditSettingMode(submitForm, isLoading);

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
      <StyledSettingBlock id={SETTINGS_CONFIG.navigation.anchor}>
        <StyledHeadSettingBlock>
          <StyledTitleBlock>
            {SETTINGS_CONFIG.navigation.title}
            <SaveButton
              isEdit={isEdit}
              isLoading={isLoading}
              handleAction={handleAction}
            />
          </StyledTitleBlock>

          <StyledDescriptionBlock>
            {SETTINGS_CONFIG.navigation.description}
          </StyledDescriptionBlock>
        </StyledHeadSettingBlock>

        <DragDropContext onDragEnd={onDragEndPrimary}>
          <Droppable droppableId="droppable-list">
            {(provided) => (
              <StyledNavigationWrap
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
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
                            <ItemNavigation
                              id={el.id}
                              isEdit={isEdit}
                              title={el.title}
                              link={el.link}
                              handleResetNavigation={handleResetNavigation}
                              handleRemoveLinkNavigation={
                                handleRemoveLinkNavigation
                              }
                              handleChangeNavigation={handleChangeNavigation}
                            />
                          </StyledItemNavigation>
                        )}
                      </Draggable>
                    );
                  })}
                {provided.placeholder}
              </StyledNavigationWrap>
            )}
          </Droppable>
        </DragDropContext>

        {isEdit && (
          <Button
            sx={{ marginTop: "16px" }}
            variant="contained"
            fullWidth
            color="decorate"
            size="large"
            endIcon={<PlusCircleIcon fontSize="inherit" />}
            onClick={() => handleAddLinkNavigation("primary")}
          >
            Add title & link
          </Button>
        )}
      </StyledSettingBlock>
    );
  },
);

Navigation.displayName = "Navigation";
