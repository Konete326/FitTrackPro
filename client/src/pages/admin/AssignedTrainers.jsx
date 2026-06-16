import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import { getCoachingAssignments } from '../../services/adminService';
import { FiUsers } from 'react-icons/fi';

function AssignedTrainers() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getCoachingAssignments();
      setAssignments(data?.data || data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAssignments(); }, [fetchAssignments]);

  const assignmentList = Array.isArray(assignments) ? assignments : [];

  return (
    <AdminLayout pageTitle="Assigned Trainers">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        View all trainer-client assignments across the platform.
      </p>

      {loading ? (
        <Skeleton type="table" />
      ) : assignmentList.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FiUsers className="w-12 h-12" />}
            title="No assignments"
            description="Trainer-client assignments will appear here once trainers are assigned to users."
          />
        </Card>
      ) : (
        <Card className="!p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700/60">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Client</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Trainer</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                {assignmentList.map((a, i) => (
                  <tr key={a._id || i} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{a.clientName || a.client?.Profile?.Name || a.User?.Profile?.Name || 'User'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{a.clientEmail || a.client?.Email || a.User?.Email || ''}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{a.trainerName || a.trainer?.Profile?.Name || a.Trainer?.Profile?.Name || 'Trainer'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{a.trainerEmail || a.trainer?.Email || a.Trainer?.Email || ''}</p>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="green">Active</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </AdminLayout>
  );
}

export default AssignedTrainers;