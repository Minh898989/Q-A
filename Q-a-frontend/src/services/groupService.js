import axiosInstance from './axiosInstance';

export const getAllGroups = () =>
    axiosInstance.get('/groups');

export const getGroupById = (groupId) =>
    axiosInstance.get(`/groups/${groupId}`);

export const getGroupsWithLecturer = () =>
    axiosInstance.get('/groups/lecture');

export const createGroup = (groupData) =>
    axiosInstance.post('/groups', groupData);

export const updateGroup = (groupId, groupData) =>
    axiosInstance.put(`/groups/${groupId}`, groupData);

export const deleteGroup = (groupId) =>
    axiosInstance.delete(`/groups/${groupId}`);

export const joinGroup = (groupId) =>
    axiosInstance.post('/group_member/join_group', { groupId });

export const getPendingMembers = (groupId) =>
    axiosInstance.get(`/group_member/pending_member/${groupId}`);

export const getAcceptedMembers = (groupId) =>
    axiosInstance.get(`/group_member/accepted_member/${groupId}`);

export const updateMemberStatus = (groupId, userId, status) =>
    axiosInstance.put(`/group_member/update_accepted/${groupId}`, {
        userId,
        status,
    });

export const deleteMember = (groupId, userId) =>
    axiosInstance.delete(`/group_member/delete_rejected/${groupId}/${userId}`);