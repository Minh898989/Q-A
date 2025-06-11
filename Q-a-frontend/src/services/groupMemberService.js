import axiosInstance from './axiosInstance';

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

export const deleteMember = (userId) =>
    axiosInstance.delete(`/group_member/delete_rejected/${userId}`);

export const getGroupById = (groupId) =>
    axiosInstance.get(`/groups/${groupId}`);