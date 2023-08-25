import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { Notification } from "./Notification";

type NoSelectedConversationNotificationProps = {
  onStartNewConversation?: VoidFunction;
};

export const NoSelectedConversationNotification: React.FC<
  NoSelectedConversationNotificationProps
> = ({ onStartNewConversation }) => (
  <Notification
    cta={
      <button className="Button" type="button" onClick={onStartNewConversation}>
        MESSAGE
      </button>
    }
    icon={<ChatBubbleLeftRightIcon />}
    title="Start the conversation">
  </Notification>
);
