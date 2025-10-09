/*******************************
 * UI 组件库统一导出
 *******************************/

// 基础组件
export { Button, IconButton, ButtonGroup, SplitButton, Fab, LoadingButton } from './Button'
export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription, CardImage, CardBadge, CardActions, CardSkeleton, CardGrid, CardCarousel } from './Card'
export { OptimizedImage, ResponsiveImage, Avatar } from './OptimizedImage'
export { Grid, GridItem, Container, Flex, Stack, Spacer } from './Grid'

// 排版组件
export {
  Heading,
  Text,
  Link,
  Code,
  Blockquote,
  List,
  Divider,
  Highlight,
  Kbd,
  TextTruncate,
  ResponsiveText
} from './Typography'

// 工具函数和 Hooks
export { useLazyLoad, useImagePerformance } from './OptimizedImage'

// 默认导出所有组件
export default {
  // 按钮组件
  Button,
  IconButton,
  ButtonGroup,
  SplitButton,
  Fab,
  LoadingButton,

  // 卡片组件
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
  CardImage,
  CardBadge,
  CardActions,
  CardSkeleton,
  CardGrid,
  CardCarousel,

  // 图片组件
  OptimizedImage,
  ResponsiveImage,
  Avatar,

  // 布局组件
  Grid,
  GridItem,
  Container,
  Flex,
  Stack,
  Spacer,

  // 排版组件
  Heading,
  Text,
  Link,
  Code,
  Blockquote,
  List,
  Divider,
  Highlight,
  Kbd,
  TextTruncate,
  ResponsiveText,
}