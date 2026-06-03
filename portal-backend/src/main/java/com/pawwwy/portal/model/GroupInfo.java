package com.pawwwy.portal.model;

import java.util.List;

/**
 * Group / course / university metadata served to the frontend
 * for the Team page and footer.
 */
public class GroupInfo {

    private final String projectName;
    private final String tagline;
    private final String batch;
    private final String course;
    private final String university;
    private final List<Member> members;

    public GroupInfo(String projectName,
                     String tagline,
                     String batch,
                     String course,
                     String university,
                     List<Member> members) {
        this.projectName = projectName;
        this.tagline = tagline;
        this.batch = batch;
        this.course = course;
        this.university = university;
        this.members = members;
    }

    public String getProjectName() { return projectName; }
    public String getTagline() { return tagline; }
    public String getBatch() { return batch; }
    public String getCourse() { return course; }
    public String getUniversity() { return university; }
    public List<Member> getMembers() { return members; }
}
