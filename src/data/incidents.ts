export type Incident = {
  id: string
  title: string
  message: string
  effects: { academicScore?: number; funding?: number; reputation?: number; studentLoyalty?: number }
  sinDelta?: number
}

export const incidents: Record<string, Incident> = {
  incident_jump: {
    id: 'incident_jump',
    title: '校园跳楼意外',
    message: '一名学生发生跳楼意外，校内震动，媒体关注',
    effects: { reputation: -10, studentLoyalty: -20 },
    sinDelta: 15,
  },
  incident_fraud_exposed: {
    id: 'incident_fraud_exposed',
    title: '学术造假被曝光',
    message: '你的团队被曝学术造假，基金撤回，声誉受损',
    effects: { funding: -20, reputation: -15 },
    sinDelta: 20,
  },
  incident_windfall: {
    id: 'incident_windfall',
    title: '意外荣誉与资助',
    message: '你意外获得重量级荣誉与资助，团队士气高涨',
    effects: { funding: 50, reputation: 5 },
  },
  incident_assault_report: {
    id: 'incident_assault_report',
    title: '学生举报殴打',
    message: '学生向校方举报你对其实施肢体冲突，校纪处分调查展开',
    effects: { reputation: -8 },
    sinDelta: 10,
  }
}
