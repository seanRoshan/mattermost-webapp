// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {bindActionCreators, Dispatch} from 'redux';
import {connect} from 'react-redux';

import {getAssociatedGroupsForReference} from 'mattermost-redux/selectors/entities/groups';

import {getCurrentTeamId} from 'mattermost-redux/selectors/entities/teams';

import {getCurrentUserId, makeGetProfilesInChannel, makeGetProfilesNotInChannel} from 'mattermost-redux/selectors/entities/users';
import {GlobalState} from 'mattermost-redux/types/store';
import {GenericAction} from 'mattermost-redux/types/actions';

import {autocompleteUsersInChannel} from 'actions/views/channel';
import {searchAssociatedGroupsForReference} from 'actions/views/group';
import {autocompleteChannels} from 'actions/channel_actions';

import Textbox from './textbox';

type Props = {
    channelId: string;
};

/* eslint-disable camelcase */

const makeMapStateToProps = () => {
    const getProfilesInChannel = makeGetProfilesInChannel();
    const getProfilesNotInChannel = makeGetProfilesNotInChannel();

    return (state: GlobalState, ownProps: Props) => {
        const teamId = getCurrentTeamId(state);
        return {
            currentUserId: getCurrentUserId(state),
            currentTeamId: teamId,
            profilesInChannel: getProfilesInChannel(state, ownProps.channelId, true),
            profilesNotInChannel: getProfilesNotInChannel(state, ownProps.channelId, true),
            autocompleteGroups: getAssociatedGroupsForReference(state, teamId, ownProps.channelId)
        };
    };
};

const mapDispatchToProps = (dispatch: Dispatch<GenericAction>) => ({
    actions: bindActionCreators({
        autocompleteUsersInChannel,
        autocompleteChannels,
        searchAssociatedGroupsForReference,
    }, dispatch),
});

const connectedTextbox = connect(makeMapStateToProps, mapDispatchToProps, null, {forwardRef: true})(Textbox);
export default connectedTextbox;

// Attach the Textbox to the window object so that plugins can use it.
window.Textbox = connectedTextbox;

