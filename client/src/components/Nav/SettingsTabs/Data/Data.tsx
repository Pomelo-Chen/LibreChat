import React, { useState, useRef } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { useClearConversationsMutation } from 'librechat-data-provider/react-query';
import { SettingsTabValues } from 'librechat-data-provider';
import { useConversation, useConversations, useOnClickOutside } from '~/hooks';
import { RevokeKeysButton } from './RevokeKeysButton';
import { DeleteCacheButton } from './DeleteCacheButton';
import ImportConversations from './ImportConversations';
import { ClearChatsButton } from './ClearChats';

function Data() {
  const dataTabRef = useRef(null);
  const [confirmClearConvos, setConfirmClearConvos] = useState(false);
  useOnClickOutside(dataTabRef, () => confirmClearConvos && setConfirmClearConvos(false), []);

  const { newConversation } = useConversation();
  const { refreshConversations } = useConversations();
  const clearConvosMutation = useClearConversationsMutation();

  const clearConvos = () => {
    if (confirmClearConvos) {
      console.log('Clearing conversations...');
      setConfirmClearConvos(false);
      clearConvosMutation.mutate(
        {},
        {
          onSuccess: () => {
            newConversation();
            refreshConversations();
          },
        },
      );
    } else {
      setConfirmClearConvos(true);
    }
  };

  return (
    <Tabs.Content
      value={SettingsTabValues.DATA}
      role="tabpanel"
      className="w-full md:min-h-[300px]"
      ref={dataTabRef}
    >
      <div className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-50">
        <div className="border-b pb-3 last-of-type:border-b-0 dark:border-gray-700">
          <ImportConversations />
        </div>
        <div className="border-b pb-3 last-of-type:border-b-0 dark:border-gray-700">
          <RevokeKeysButton all={true} />
        </div>
        <div className="border-b pb-3 last-of-type:border-b-0 dark:border-gray-700">
          <DeleteCacheButton />
        </div>
        <div className="border-b pb-3 last-of-type:border-b-0 dark:border-gray-700">
          <ClearChatsButton
            confirmClear={confirmClearConvos}
            onClick={clearConvos}
            showText={true}
            mutation={clearConvosMutation}
          />
        </div>
      </div>
    </Tabs.Content>
  );
}

export default React.memo(Data);
