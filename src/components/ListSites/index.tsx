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
import { useFirstPathElement } from "@/hooks/useFirstPathElement";

type ListSitesType = {
  data: ReturnSitesDataType[];
};
export const ListSites = ({ data }: ListSitesType) => {
  const router = useRouter();
  const pathAdmin = useFirstPathElement();

  const handleSelect = (id: string) => {
    router.push(`${pathAdmin}/${id}`);
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
                  <Avatar alt={el.title} src={el.icon} />
                </ListItemAvatar>
                <ListItemText
                  primary={el.title}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "block" }}
                        component="span"
                        variant="body1"
                        color="text.primary"
                      >
                        <b>URL:</b> {el.url}
                      </Typography>
                      <Typography
                        sx={{ display: "block" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {el.description}
                      </Typography>
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
