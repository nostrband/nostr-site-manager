"use client";
import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { ReturnSitesDataType } from "@/services/sites.service";
import { StyledList, StyledListWrap } from "@/components/ListSites/styled";

type ListSitesType = {
  data: ReturnSitesDataType[];
};
export const ListSites = ({ data }: ListSitesType) => {
  const router = useRouter();

  const handleSelect = (id: string) => {
    router.push(`/${id}`);
  };

  return (
    <StyledListWrap>
      <StyledList component="nav">
        {data.map((el, i) => {
          return (
            <React.Fragment key={i}>
              <ListItemButton
                alignItems="flex-start"
                onClick={() => handleSelect(el.id)}
              >
                <ListItemAvatar>
                  <Avatar alt={el.title} src="#" />
                </ListItemAvatar>
                <ListItemText
                  primary={el.title}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        ID: {el.id}
                      </Typography>
                      {" — some description about site"}
                    </React.Fragment>
                  }
                />
              </ListItemButton>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          );
        })}
      </StyledList>
    </StyledListWrap>
  );
};
