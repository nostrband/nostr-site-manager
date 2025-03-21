import {
  ArrowRightIcon,
  BarChartIcon,
  FIleTextIcon,
  HeartIcon,
  LoginIcon,
  UsersIcon,
} from "@/components/Icons";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { fetchSiteStats, SiteStats } from "@/services/nostr/stats";
import { useCallback, useEffect, useState } from "react";
import {
  StyledItemStat,
  StyledItemStatIcon,
  StyledItemStatTitle,
  StyledItemStatValue,
  StyledStatsLoading,
  StyledStatsSubTitle,
} from "./styled";
import { Button } from "@mui/material";
import Link from "next/link";
import { userIsDelegated, userIsReadOnly } from "@/services/nostr/nostr";
import { CardFeatureContent } from "@/components/shared/CardFeatureContent";

interface AnalyticsSiteProps {
  siteId: string;
  isSendStats: boolean;
}

const initialStats = [
  {
    title: "Page views",
    key: "pageviews",
    value: 0,
    icon: <FIleTextIcon />,
  },
  {
    title: "Visits",
    key: "visits",
    value: 0,
    icon: <BarChartIcon />,
  },
  {
    title: "Users",
    key: "npubs",
    value: 0,
    icon: <UsersIcon />,
  },
  {
    title: "Sign-ups",
    key: "signups",
    value: 0,
    icon: <LoginIcon />,
  },
  {
    title: "Reactions & comments",
    key: "reactions",
    value: 0,
    icon: <HeartIcon />,
  },
];

export const AnalyticsSite = ({ siteId, isSendStats }: AnalyticsSiteProps) => {
  const [isLoading, setLoading] = useState(false);
  const [stats, setStats] = useState(initialStats);

  const linkOpenSettings = `/admin/${siteId}/settings#stats-admin`;

  const getStats = useCallback(async (id: string) => {
    setLoading(true);

    try {
      const {
        last7d: { totals },
      }: SiteStats = await fetchSiteStats(id);

      setStats((prev) => {
        return prev.map((stat) => ({
          ...stat,
          value: totals[stat.key as keyof typeof totals] || 0,
        }));
      });
    } catch (error) {
      console.log(error);
      setStats(initialStats);
    } finally {
      setLoading(false);
    }
  }, []);

  const showStats = isSendStats && !userIsDelegated && !userIsReadOnly;
  useEffect(() => {
    if (showStats) {
      getStats(siteId);
    }
  }, [isSendStats, siteId, getStats]);

  return (
    <CardFeatureContent title="Analytics (last week)">
      {showStats &&
        (isLoading ? (
          <StyledStatsLoading>
            <SpinerWrap>
              <SpinerCircularProgress />
            </SpinerWrap>
          </StyledStatsLoading>
        ) : (
          <>
            {stats.map((el, i) => (
              <StyledItemStat key={i}>
                <StyledItemStatIcon>{el.icon}</StyledItemStatIcon>
                <StyledItemStatTitle variant="body2">
                  {el.title}
                </StyledItemStatTitle>
                <StyledItemStatValue>{el.value}</StyledItemStatValue>
              </StyledItemStat>
            ))}

            {/* <Button
              variant="outlined"
              fullWidth
              size="large"
              endIcon={<RoundChartIcon />}
            >
              Analytics
            </Button> */}
          </>
        ))}
      {isSendStats && userIsReadOnly && (
        <>
          <StyledStatsSubTitle variant="body2">
            Analytics not available in read-only mode.
          </StyledStatsSubTitle>
        </>
      )}
      {isSendStats && userIsDelegated && (
        <>
          <StyledStatsSubTitle variant="body2">
            Connect keys to view encrypted analytics.
          </StyledStatsSubTitle>
        </>
      )}
      {!isSendStats && (
        <>
          <StyledStatsSubTitle variant="body2">
            Please enable Analytics to receive encrypted statistics about your
            site visitors.
          </StyledStatsSubTitle>
          <Button
            LinkComponent={Link}
            href={linkOpenSettings}
            variant="text"
            fullWidth
            size="large"
            endIcon={<ArrowRightIcon />}
          >
            Go to settings
          </Button>
        </>
      )}
    </CardFeatureContent>
  );
};
