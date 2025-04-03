import { FC, useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { ClientPost } from "../../types";
import { ItemPost } from "./ItemPost";
import { SpinerCircularProgress } from "@/components/Spiner";

type PostsProps = {
  posts: ClientPost[];
  onImport: (selectedItems: ClientPost[]) => void;
  isPending: boolean;
  publishType: "long" | "short";
  onPublishTypeChange: (type: "long" | "short") => void;
};

export const Posts: FC<PostsProps> = ({
  posts,
  onImport,
  isPending,
  // publishType,
  // onPublishTypeChange,
}) => {
  const [selectedItems, setSelectedItems] = useState<ClientPost[]>([]);

  const handleSelectPost = (checkedPost: ClientPost) => {
    setSelectedItems((prevSelectedPosts) => {
      if (!prevSelectedPosts.find((post) => post.id === checkedPost.id)) {
        return [...prevSelectedPosts, checkedPost];
      }
      return prevSelectedPosts.filter((post) => post.id !== checkedPost.id);
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedItems(posts);
    else setSelectedItems([]);
  };

  const handleSelectAllPosts = (checked: boolean) => {
    if (checked) setSelectedItems(posts.filter((p) => p.type === "post"));
    else setSelectedItems([]);
  };

  const handleSelectAllPages = (checked: boolean) => {
    if (checked) setSelectedItems(posts.filter((p) => p.type === "page"));
    else setSelectedItems([]);
  };

  const handleSelectUnpublished = (checked: boolean) => {
    if (checked) setSelectedItems(posts.filter((p) => !p.url));
    else setSelectedItems([]);
  };

  const handleImportPosts = () => {
    if (!selectedItems.length) return;
    onImport(selectedItems);
  };

  // const handleSwitchPublishType = (_: any, checked: boolean) => {
  // 	if (checked) return onPublishTypeChange('short')
  // 	return onPublishTypeChange('long')
  // }

  if (!posts.length) {
    return (
      <Typography variant="h5" textAlign={"center"} mt={"1rem"}>
        No data
      </Typography>
    );
  }
  // Select all states
  const allIndeterminate =
    selectedItems.length > 0 && selectedItems.length < posts.length;
  const allSelected = selectedItems.length === posts.length;

  // Select all posts states
  const filteredPosts = posts.filter((p) => p.type === "post");
  const selectedPosts = selectedItems.filter((p) => p.type === "post");
  const allPostsIndeterminate =
    selectedPosts.length > 0 && selectedPosts.length < filteredPosts.length;
  const allPostsSelected =
    selectedPosts.length > 0 &&
    selectedPosts.length === filteredPosts.length &&
    !allSelected;

  // Select all pages states
  const filteredPages = posts.filter((p) => p.type === "page");
  const selectedPages = selectedItems.filter((p) => p.type === "page");
  const allPagesIndeterminate =
    selectedPages.length > 0 && selectedPages.length < filteredPages.length;
  const allPagesSelected =
    selectedPages.length > 0 &&
    selectedPages.length === filteredPages.length &&
    !allSelected;

  // Select unpublished states
  const filteredUnpublished = posts.filter((p) => !p.url);
  const selectedUnpublished = selectedItems.filter((p) => !p.url);
  const unpublishedIndeterminate =
    selectedUnpublished.length > 0 &&
    selectedUnpublished.length < filteredUnpublished.length;
  const unpublishedSelected =
    selectedUnpublished.length > 0 &&
    selectedUnpublished.length === filteredUnpublished.length &&
    !allSelected;

  return (
    <Stack gap={"1rem"}>
      <Stack
        direction={"row"}
        justifyContent={"flex-end"}
        alignItems={"center"}
      >
        <FormControlLabel
          control={
            <Checkbox
              id="select-all-posts"
              checked={allPostsSelected}
              indeterminate={allPostsIndeterminate}
              onChange={(e) => handleSelectAllPosts(e.target.checked)}
            />
          }
          label="Select Posts"
        />
        <FormControlLabel
          control={
            <Checkbox
              id="select-all-pages"
              checked={allPagesSelected}
              indeterminate={allPagesIndeterminate}
              onChange={(e) => handleSelectAllPages(e.target.checked)}
            />
          }
          label="Select Pages"
        />
        <FormControlLabel
          control={
            <Checkbox
              id="select-unpublished"
              checked={unpublishedSelected}
              indeterminate={unpublishedIndeterminate}
              onChange={(e) => handleSelectUnpublished(e.target.checked)}
            />
          }
          label="Select Unpublished"
        />
        <FormControlLabel
          control={
            <Checkbox
              id="select-all"
              checked={allSelected}
              indeterminate={allIndeterminate}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
          }
          label="Select All"
        />
      </Stack>

      <Stack gap={"1rem"}>
        {posts.map((post, i) => (
          <ItemPost
            {...post}
            checked={selectedItems.some((p) => p.id === post.id)}
            key={i}
            onCheckboxChange={() => handleSelectPost(post)}
          />
        ))}
      </Stack>

      {/* <Stack
				direction={'row'}
				alignItems={'center'}
				justifyContent={'center'}
			>
				<Typography
					component={'label'}
					htmlFor='switcher'
					variant='body2'
				>
					Publish as long-form posts
				</Typography>
				<Switch
					id='switcher'
					checked={publishType === 'short'}
					onChange={handleSwitchPublishType}
				/>
				<Typography
					component={'label'}
					htmlFor='switcher'
					variant='body2'
				>
					Publish as short notes
				</Typography>
			</Stack>
 */}
      <Button
        variant="contained"
        onClick={handleImportPosts}
        disabled={!selectedItems.length || isPending}
      >
        <Stack direction={"row"} gap={"1rem"} alignItems={"center"}>
          Publish {selectedItems.length} posts
          {isPending && <SpinerCircularProgress size={17} color="secondary" />}
        </Stack>
      </Button>
    </Stack>
  );
};
